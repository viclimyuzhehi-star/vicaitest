/**
 * Vic AI Usage Examples
 * Demonstrates how to use Vic AI as an importable package
 */

// ============================================================================
// BASIC USAGE EXAMPLES
// ============================================================================

// Import Vic AI functions
import { chat, generateCode, teach, createVicAI, initializeVicAI } from '../index.js'

console.log('🚀 Vic AI Usage Examples')
console.log('========================\n')

// Example 1: Simple Chat
async function example1() {
  console.log('📝 Example 1: Simple Chat')
  try {
    const response = await chat('Hello, how are you feeling today?')
    console.log('Response:', response)
  } catch (error) {
    console.error('Error:', error.message)
  }
  console.log('')
}

// Example 2: Code Generation
async function example2() {
  console.log('💻 Example 2: Code Generation')
  try {
    const code = await generateCode('Create a React button component', 'javascript')
    console.log('Generated Code:')
    console.log(code)
  } catch (error) {
    console.error('Error:', error.message)
  }
  console.log('')
}

// Example 3: Teaching
async function example3() {
  console.log('🎓 Example 3: Teaching')
  try {
    const lesson = await teach('machine learning', 'beginner')
    console.log('Lesson Response:', lesson.content)
  } catch (error) {
    console.error('Error:', error.message)
  }
  console.log('')
}

// Example 4: Advanced VicAIBeta Usage
async function example4() {
  console.log('🧠 Example 4: VicAIBeta Advanced Usage')
  try {
    const vicAI = await createVicAI({
      doubleCheck: true,
      legalCheck: true,
      moodAnalysis: true
    })

    const result = await vicAI.think('I\'m feeling frustrated with this React bug, help me debug it')

    console.log('Enhanced Response:', result.response.content)
    console.log('Detected Mood:', result.analysis.mood.dominantMood)
    console.log('Quality Score:', result.quality.quality.score)
    console.log('Compliance Status:', result.compliance.compliant ? '✅ Passed' : '⚠️ Issues')
    console.log('Processing Time:', result.metadata.processingTime + 'ms')
  } catch (error) {
    console.error('Error:', error.message)
  }
  console.log('')
}

// Example 5: Full System Initialization
async function example5() {
  console.log('🏗️  Example 5: Full System Initialization')
  try {
    const system = await initializeVicAI({
      doubleCheck: true,
      legalCheck: true,
      moodAnalysis: true
    })

    console.log('System Version:', system.version)
    console.log('Available Features:', system.features.join(', '))
    console.log('Supported Languages:', system.supportedLanguages.join(', '))

    // Test the initialized system
    const response = await system.chat('What can you help me with?')
    console.log('System Response:', response)
  } catch (error) {
    console.error('Error:', error.message)
  }
  console.log('')
}

// Example 6: Mood Analysis
async function example6() {
  console.log('😊 Example 6: Mood Analysis')
  try {
    const { analyzeMood } = await import('../index.js')
    const analysis = await analyzeMood('I\'m so excited about this new project! 🎉')

    console.log('Text:', 'I\'m so excited about this new project! 🎉')
    console.log('Dominant Mood:', analysis.dominantEmotion)
    console.log('Intensity:', analysis.intensity)
    console.log('Confidence:', analysis.confidence)
  } catch (error) {
    console.error('Error:', error.message)
  }
  console.log('')
}

// Example 7: Quality Assurance
async function example7() {
  console.log('✅ Example 7: Quality Assurance')
  try {
    const { checkQuality } = await import('../index.js')
    const content = `function hello() { console.log("Hello World"); }`
    const quality = await checkQuality(content, 'code')

    console.log('Content:', content)
    console.log('Quality Passed:', quality.passed)
    console.log('Quality Score:', quality.quality.score)
    console.log('Issues Found:', quality.issues.length)
    console.log('Suggestions:', quality.suggestions.length)
  } catch (error) {
    console.error('Error:', error.message)
  }
  console.log('')
}

// ============================================================================
// RUN EXAMPLES
// ============================================================================

async function runExamples() {
  console.log('Running Vic AI Examples...\n')

  // Run examples sequentially
  await example1()
  await example2()
  await example3()
  await example4()
  await example5()
  await example6()
  await example7()

  console.log('✅ All examples completed!')
}

// Export for use in other files
export { runExamples }

// Auto-run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(console.error)
}