/**
 * SECURE VAULT SERVICE
 * Advanced secret management with encryption, access control, and audit logging
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'
import { encrypt, decrypt } from '../config/security.js'
import env from '../config/env.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VAULT_DIR = path.join(__dirname, '../vault')
const VAULT_FILE = path.join(VAULT_DIR, 'secrets.encrypted')
const AUDIT_LOG = path.join(VAULT_DIR, 'audit.log')

/**
 * Vault entry structure
 */
class VaultEntry {
  constructor(id, type, data, metadata = {}) {
    this.id = id
    this.type = type // 'api_key', 'database', 'jwt_secret', etc.
    this.data = data
    this.metadata = {
      ...metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    }
    this.accessLog = []
  }

  /**
   * Log access to this entry
   */
  logAccess(action, userId = 'system', ip = null) {
    this.accessLog.push({
      timestamp: new Date().toISOString(),
      action,
      userId,
      ip
    })

    // Keep only last 100 access logs
    if (this.accessLog.length > 100) {
      this.accessLog = this.accessLog.slice(-100)
    }
  }

  /**
   * Update entry data
   */
  update(data, userId = 'system') {
    this.data = data
    this.metadata.updatedAt = new Date().toISOString()
    this.metadata.version++
    this.logAccess('update', userId)
  }
}

/**
 * Secure Vault for secret management
 */
class SecureVault {
  constructor() {
    this.entries = new Map()
    this.initialized = false
    this.ensureVaultDirectory()
  }

  /**
   * Ensure vault directory exists
   */
  ensureVaultDirectory() {
    if (!fs.existsSync(VAULT_DIR)) {
      fs.mkdirSync(VAULT_DIR, { recursive: true, mode: 0o700 })
    }
  }

  /**
   * Initialize vault (load from disk)
   */
  async init() {
    if (this.initialized) return

    try {
      await this.loadVault()
      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize vault:', error.message)
      // Initialize empty vault if loading fails
      this.entries = new Map()
      this.initialized = true
    }
  }

  /**
   * Load vault from encrypted file
   */
  async loadVault() {
    if (!fs.existsSync(VAULT_FILE)) {
      this.entries = new Map()
      return
    }

    const encrypted = fs.readFileSync(VAULT_FILE, 'utf8')
    const decrypted = decrypt(encrypted)

    if (!decrypted) {
      throw new Error('Failed to decrypt vault file')
    }

    const data = JSON.parse(decrypted)
    this.entries = new Map()

    // Reconstruct VaultEntry objects
    for (const [id, entryData] of Object.entries(data.entries)) {
      const entry = new VaultEntry(
        entryData.id,
        entryData.type,
        entryData.data,
        entryData.metadata
      )
      entry.accessLog = entryData.accessLog || []
      this.entries.set(id, entry)
    }
  }

  /**
   * Save vault to encrypted file
   */
  async saveVault() {
    const data = {
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      entries: Object.fromEntries(this.entries)
    }

    const json = JSON.stringify(data, null, 2)
    const encrypted = encrypt(json)

    // Write to temporary file first, then rename for atomicity
    const tempFile = VAULT_FILE + '.tmp'
    fs.writeFileSync(tempFile, encrypted, { mode: 0o600 })
    fs.renameSync(tempFile, VAULT_FILE)
  }

  /**
   * Store a secret in the vault
   */
  async store(id, type, data, userId = 'system', metadata = {}) {
    await this.init()

    const entry = new VaultEntry(id, type, data, metadata)
    entry.logAccess('create', userId)

    this.entries.set(id, entry)
    await this.saveVault()

    await this.auditLog('store', { id, type, userId })
  }

  /**
   * Retrieve a secret from the vault
   */
  async retrieve(id, userId = 'system') {
    await this.init()

    const entry = this.entries.get(id)
    if (!entry) {
      await this.auditLog('retrieve_fail', { id, userId, reason: 'not_found' })
      return null
    }

    entry.logAccess('retrieve', userId)
    await this.saveVault()

    await this.auditLog('retrieve', { id, type: entry.type, userId })
    return entry.data
  }

  /**
   * Update a secret in the vault
   */
  async update(id, data, userId = 'system') {
    await this.init()

    const entry = this.entries.get(id)
    if (!entry) {
      throw new Error(`Secret ${id} not found`)
    }

    entry.update(data, userId)
    await this.saveVault()

    await this.auditLog('update', { id, type: entry.type, userId })
  }

  /**
   * Delete a secret from the vault
   */
  async delete(id, userId = 'system') {
    await this.init()

    const entry = this.entries.get(id)
    if (!entry) {
      await this.auditLog('delete_fail', { id, userId, reason: 'not_found' })
      return false
    }

    entry.logAccess('delete', userId)
    this.entries.delete(id)
    await this.saveVault()

    await this.auditLog('delete', { id, type: entry.type, userId })
    return true
  }

  /**
   * List all secret IDs (without revealing data)
   */
  async list(userId = 'system') {
    await this.init()

    const secrets = []
    for (const [id, entry] of this.entries) {
      secrets.push({
        id,
        type: entry.type,
        createdAt: entry.metadata.createdAt,
        updatedAt: entry.metadata.updatedAt,
        version: entry.metadata.version,
        lastAccessed: entry.accessLog.length > 0 ?
          entry.accessLog[entry.accessLog.length - 1].timestamp : null
      })
    }

    await this.auditLog('list', { count: secrets.length, userId })
    return secrets
  }

  /**
   * Get metadata for a specific secret
   */
  async getMetadata(id, userId = 'system') {
    await this.init()

    const entry = this.entries.get(id)
    if (!entry) {
      return null
    }

    entry.logAccess('metadata', userId)
    await this.saveVault()

    return {
      id: entry.id,
      type: entry.type,
      metadata: entry.metadata,
      accessCount: entry.accessLog.length,
      lastAccessed: entry.accessLog.length > 0 ?
        entry.accessLog[entry.accessLog.length - 1] : null
    }
  }

  /**
   * Rotate encryption keys (advanced feature)
   */
  async rotateKeys(newKey) {
    // This would be a complex operation involving re-encrypting all data
    // For now, just log the operation
    await this.auditLog('rotate_keys', { timestamp: new Date().toISOString() })
    throw new Error('Key rotation not yet implemented')
  }

  /**
   * Backup vault to external location
   */
  async backup(backupPath) {
    if (!fs.existsSync(VAULT_FILE)) {
      throw new Error('Vault file does not exist')
    }

    const backupFile = path.join(backupPath, `vault_backup_${Date.now()}.encrypted`)
    fs.copyFileSync(VAULT_FILE, backupFile)

    await this.auditLog('backup', { backupFile })
    return backupFile
  }

  /**
   * Restore vault from backup
   */
  async restore(backupFile) {
    if (!fs.existsSync(backupFile)) {
      throw new Error('Backup file does not exist')
    }

    // Create backup of current vault
    if (fs.existsSync(VAULT_FILE)) {
      const currentBackup = VAULT_FILE + '.bak'
      fs.copyFileSync(VAULT_FILE, currentBackup)
    }

    // Restore from backup
    fs.copyFileSync(backupFile, VAULT_FILE)

    // Reload vault
    this.initialized = false
    await this.init()

    await this.auditLog('restore', { backupFile })
  }

  /**
   * Audit logging
   */
  async auditLog(action, details) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      details
    }

    const logLine = JSON.stringify(logEntry) + '\n'

    try {
      fs.appendFileSync(AUDIT_LOG, logLine, { mode: 0o600 })
    } catch (error) {
      console.error('Failed to write audit log:', error)
    }
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(limit = 100) {
    if (!fs.existsSync(AUDIT_LOG)) {
      return []
    }

    const logs = fs.readFileSync(AUDIT_LOG, 'utf8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line))
      .slice(-limit)

    return logs
  }

  /**
   * Health check for vault
   */
  async healthCheck() {
    const issues = []

    // Check vault directory permissions
    try {
      const stats = fs.statSync(VAULT_DIR)
      if ((stats.mode & 0o777) !== 0o700) {
        issues.push('Vault directory has incorrect permissions')
      }
    } catch (error) {
      issues.push('Cannot access vault directory')
    }

    // Check vault file
    if (fs.existsSync(VAULT_FILE)) {
      try {
        const stats = fs.statSync(VAULT_FILE)
        if ((stats.mode & 0o777) !== 0o600) {
          issues.push('Vault file has incorrect permissions')
        }
      } catch (error) {
        issues.push('Cannot access vault file')
      }
    }

    // Check audit log
    if (fs.existsSync(AUDIT_LOG)) {
      try {
        const stats = fs.statSync(AUDIT_LOG)
        if ((stats.mode & 0o777) !== 0o600) {
          issues.push('Audit log has incorrect permissions')
        }
      } catch (error) {
        issues.push('Cannot access audit log')
      }
    }

    return {
      healthy: issues.length === 0,
      issues,
      stats: {
        entriesCount: this.entries.size,
        vaultFileExists: fs.existsSync(VAULT_FILE),
        auditLogExists: fs.existsSync(AUDIT_LOG)
      }
    }
  }
}

// Export singleton instance
const vault = new SecureVault()

export default vault
export { SecureVault, VaultEntry }