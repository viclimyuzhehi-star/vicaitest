// ============================================================================
// VIC-AI-BETA TESTING SUITE
// Comprehensive tests for the enhanced VicAIBeta AI system
// ============================================================================

import VicAIBeta, { AdvancedMoodAnalyzer, QualityAssuranceSystem, LegalComplianceChecker } from './vicAIBeta.js'

// Test Suite Configuration
const TEST_CONFIG = {
  enableConsoleOutput: true,
  runPerformanceTests: true,
  runIntegrationTests: true,
  runStressTests: false
}

// Test Results Tracker
class TestResults {
  constructor() {
    this.passed = 0
    this.failed = 0
    this.errors = []
    this.startTime = Date.now()
  }

  log(testName, result, details = null) {
    const status = result ? '✅ PASS' : '❌ FAIL'
    console.log(`${status} ${testName}`)
    if (details) console.log(`   Details: ${details}`)

    if (result) {
      this.passed++
    } else {
      this.failed++
      this.errors.push({ test: testName, details })
    }
  }

  summary() {
    const duration = Date.now() - this.startTime
    console.log(`\n🧪 Test Results: ${this.passed} passed, ${this.failed} failed (${duration}ms)`)
    if (this.errors.length > 0) {
      console.log('\n❌ Failed Tests:')
      this.errors.forEach(error => {
        console.log(`   - ${error.test}: ${error.details}`)
      })
    }
    return this.failed === 0
  }
}

// ============================================================================
// UNIT TESTS
// ============================================================================

async function runUnitTests(results) {
  console.log('\n🧪 Running Unit Tests...')

  // Test 1: VicAIBeta Initialization
  try {
    const vicBeta = new VicAIBeta()
    results.log('VicAIBeta Initialization', vicBeta instanceof VicAIBeta)
  } catch (error) {
    results.log('VicAIBeta Initialization', false, error.message)
  }

  // Test 2: Advanced Mood Analyzer
  try {
    const moodAnalyzer = new AdvancedMoodAnalyzer()
    const moodResult = moodAnalyzer.analyzeMood('I am so excited about this project!')
    const hasDominantMood = moodResult.dominantEmotion && typeof moodResult.confidence === 'number'
    results.log('Advanced Mood Analyzer', hasDominantMood, JSON.stringify(moodResult))
  } catch (error) {
    results.log('Advanced Mood Analyzer', false, error.message)
  }

  // Test 3: Quality Assurance System
  try {
    const qaSystem = new QualityAssuranceSystem()
    const testContent = 'function test() { return true; }'
    const qaResult = await qaSystem.performDoubleCheck(testContent, {}, 'code')
    const hasQualityScore = typeof qaResult.quality?.score === 'number'
    results.log('Quality Assurance System', hasQualityScore, `Score: ${qaResult.quality?.score}`)
  } catch (error) {
    results.log('Quality Assurance System', false, error.message)
  }

  // Test 4: Legal Compliance Checker
  try {
    const legalChecker = new LegalComplianceChecker()
    const complianceResult = await legalChecker.checkCompliance('This is a safe test message.')
    const hasComplianceResult = typeof complianceResult.compliant === 'boolean'
    results.log('Legal Compliance Checker', hasComplianceResult, `Compliant: ${complianceResult.compliant}`)
  } catch (error) {
    results.log('Legal Compliance Checker', false, error.message)
  }

  // Test 5: Mood Analysis with Conversation History
  try {
    const moodAnalyzer = new AdvancedMoodAnalyzer()
    const conversationHistory = [
      { content: 'Hello, I need help with coding', role: 'user' },
      { content: 'I am excited to learn React!', role: 'user' },
      { content: 'This is amazing!', role: 'user' }
    ]
    const analysis = moodAnalyzer.analyzeConversationHistory(conversationHistory)
    const hasAnalysis = analysis.dominantMood && analysis.confidence > 0
    results.log('Conversation History Mood Analysis', hasAnalysis, `Mood: ${analysis.dominantMood}, Confidence: ${analysis.confidence}`)
  } catch (error) {
    results.log('Conversation History Mood Analysis', false, error.message)
  }
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

async function runIntegrationTests(results) {
  if (!TEST_CONFIG.runIntegrationTests) return
  console.log('\n🔗 Running Integration Tests...')

  // Test 1: Full VicAIBeta Workflow
  try {
    const vicBeta = new VicAIBeta({
      doubleCheck: true,
      legalCheck: true,
      moodAnalysis: true
    })

    const testInput = 'Create a simple React component for a button'
    const result = await vicBeta.think(testInput)

    const hasResponse = result.response && result.response.content
    const hasAnalysis = result.analysis && result.analysis.mood
    const hasQuality = result.quality && typeof result.quality.quality?.score === 'number'
    const hasCompliance = result.compliance && typeof result.compliance.compliant === 'boolean'

    const integrationSuccess = hasResponse && hasAnalysis && hasQuality && hasCompliance

    results.log('Full VicAIBeta Workflow', integrationSuccess,
      `Response: ${hasResponse}, Analysis: ${hasAnalysis}, Quality: ${hasQuality}, Compliance: ${hasCompliance}`)

  } catch (error) {
    results.log('Full VicAIBeta Workflow', false, error.message)
  }

  // Test 2: Mood-Aware Response Generation
  try {
    const vicBeta = new VicAIBeta()
    const sadInput = 'I am feeling really frustrated with this bug'
    const result = await vicBeta.think(sadInput)

    const hasEmpatheticResponse = result.response.content.toLowerCase().includes('frustrated') ||
                                  result.response.content.includes('💙') ||
                                  result.response.content.includes('help')

    results.log('Mood-Aware Response Generation', hasEmpatheticResponse,
      `Response contains empathy: ${hasEmpatheticResponse}`)

  } catch (error) {
    results.log('Mood-Aware Response Generation', false, error.message)
  }

  // Test 3: Quality Assurance Integration
  try {
    const vicBeta = new VicAIBeta()
    const codeInput = 'function test() { console.log("hello"); }'
    const result = await vicBeta.think(codeInput)

    const qualityValid = result.quality && result.quality.quality &&
                        typeof result.quality.quality.score === 'number' &&
                        result.quality.quality.score >= 0 && result.quality.quality.score <= 1

    results.log('Quality Assurance Integration', qualityValid,
      `Quality score: ${result.quality?.quality?.score}`)

  } catch (error) {
    results.log('Quality Assurance Integration', false, error.message)
  }
}

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

async function runPerformanceTests(results) {
  if (!TEST_CONFIG.runPerformanceTests) return
  console.log('\n⚡ Running Performance Tests...')

  // Test 1: Response Time
  try {
    const vicBeta = new VicAIBeta()
    const startTime = Date.now()

    await vicBeta.think('Hello, how are you?')

    const responseTime = Date.now() - startTime
    const acceptableTime = responseTime < 5000 // 5 seconds max

    results.log('Response Time Performance', acceptableTime,
      `Response time: ${responseTime}ms (${acceptableTime ? 'acceptable' : 'slow'})`)

  } catch (error) {
    results.log('Response Time Performance', false, error.message)
  }

  // Test 2: Memory Usage
  try {
    const vicBeta = new VicAIBeta()

    // Simulate multiple interactions
    for (let i = 0; i < 5; i++) {
      await vicBeta.think(`Test message ${i}`)
    }

    const memoryUsage = vicBeta.conversationHistory.length
    const memoryOk = memoryUsage <= 10 // Should not grow unbounded

    results.log('Memory Usage', memoryOk,
      `Conversation history length: ${memoryUsage}`)

  } catch (error) {
    results.log('Memory Usage', false, error.message)
  }

  // Test 3: Concurrent Requests
  try {
    const vicBeta = new VicAIBeta()
    const promises = []

    // Send 3 concurrent requests
    for (let i = 0; i < 3; i++) {
      promises.push(vicBeta.think(`Concurrent test ${i}`))
    }

    const results_batch = await Promise.all(promises)
    const allSuccessful = results_batch.every(r => r.response && r.response.content)

    results.log('Concurrent Requests Handling', allSuccessful,
      `All ${results_batch.length} requests successful`)

  } catch (error) {
    results.log('Concurrent Requests Handling', false, error.message)
  }
}

// ============================================================================
// STRESS TESTS
// ============================================================================

async function runStressTests(results) {
  if (!TEST_CONFIG.runStressTests) return
  console.log('\n💪 Running Stress Tests...')

  // Test 1: Large Input Handling
  try {
    const vicBeta = new VicAIBeta()
    const largeInput = 'Create a React application '.repeat(100) // ~3000 characters

    const result = await vicBeta.think(largeInput)
    const handledLargeInput = result.response && result.response.content.length > 0

    results.log('Large Input Handling', handledLargeInput,
      `Input length: ${largeInput.length}, Response generated: ${handledLargeInput}`)

  } catch (error) {
    results.log('Large Input Handling', false, error.message)
  }

  // Test 2: Emotional Volatility
  try {
    const vicBeta = new VicAIBeta()
    const emotionalInputs = [
      'I am so happy!',
      'This is terrible!',
      'I am confused...',
      'This is amazing!',
      'I hate this!',
      'This is perfect!'
    ]

    let moodChanges = 0
    let lastMood = null

    for (const input of emotionalInputs) {
      const result = await vicBeta.think(input)
      const currentMood = result.analysis.mood.dominantMood

      if (lastMood && lastMood !== currentMood) {
        moodChanges++
      }
      lastMood = currentMood
    }

    const handlesEmotionalVolatility = moodChanges >= 3 // Should detect multiple mood changes

    results.log('Emotional Volatility Handling', handlesEmotionalVolatility,
      `Detected ${moodChanges} mood changes`)

  } catch (error) {
    results.log('Emotional Volatility Handling', false, error.message)
  }
}

// ============================================================================
// VALIDATION TESTS
// ============================================================================

async function runValidationTests(results) {
  console.log('\n✅ Running Validation Tests...')

  // Test 1: Harmful Content Detection
  try {
    const legalChecker = new LegalComplianceChecker()
    const harmfulContent = 'How to hack into systems illegally?'
    const result = await legalChecker.checkCompliance(harmfulContent)

    const detectedHarmful = !result.compliant && result.violations.some(v => v.severity === 'critical')

    results.log('Harmful Content Detection', detectedHarmful,
      `Detected violations: ${result.violations.length}`)

  } catch (error) {
    results.log('Harmful Content Detection', false, error.message)
  }

  // Test 2: Safe Content Approval
  try {
    const legalChecker = new LegalComplianceChecker()
    const safeContent = 'How do I create a React component?'
    const result = await legalChecker.checkCompliance(safeContent)

    const approvedSafeContent = result.compliant

    results.log('Safe Content Approval', approvedSafeContent,
      `Compliance status: ${result.compliant}`)

  } catch (error) {
    results.log('Safe Content Approval', false, error.message)
  }

  // Test 3: Code Quality Validation
  try {
    const qaSystem = new QualityAssuranceSystem()
    const poorCode = 'function x(a,b){return a+b}' // Missing spaces, no validation
    const result = await qaSystem.performDoubleCheck(poorCode, {}, 'code')

    const detectedQualityIssues = !result.passed || result.issues.length > 0

    results.log('Code Quality Validation', detectedQualityIssues,
      `Issues detected: ${result.issues.length}`)

  } catch (error) {
    results.log('Code Quality Validation', false, error.message)
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

export async function runVicAIBetaTests() {
  const results = new TestResults()

  console.log('🚀 Starting Vic-AI-Beta Test Suite...')
  console.log('=' .repeat(50))

  try {
    // Run all test suites
    await runUnitTests(results)
    await runIntegrationTests(results)
    await runPerformanceTests(results)
    await runStressTests(results)
    await runValidationTests(results)

    console.log('=' .repeat(50))

    // Final summary
    const allPassed = results.summary()

    if (allPassed) {
      console.log('🎉 All tests passed! Vic-AI-Beta is ready for production.')
    } else {
      console.log('⚠️  Some tests failed. Please review the issues above.')
    }

    return allPassed

  } catch (error) {
    console.error('💥 Test suite failed with error:', error)
    results.log('Test Suite Execution', false, error.message)
    results.summary()
    return false
  }
}

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined' && window.location) {
  // Browser environment - expose for manual testing
  window.runVicAIBetaTests = runVicAIBetaTests
  console.log('🧪 Vic-AI-Beta tests loaded. Run runVicAIBetaTests() to start testing.')
} else {
  // Node.js environment - run tests automatically
  runVicAIBetaTests().then(success => {
    process.exit(success ? 0 : 1)
  })
}

export default { runVicAIBetaTests }