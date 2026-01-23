/**
 * LANGUAGE DETECTOR & SUBJECT KNOWLEDGE ENGINE
 * Detects user's language and handles math, science, and other subjects
 */

/**
 * LANGUAGE DETECTION
 * Detects language based on character patterns and common words
 */
class LanguageDetector {
    constructor() {
        // Character range patterns
        this.charPatterns = {
            chinese: /[\u4e00-\u9fff\u3400-\u4dbf]/,
            japanese: /[\u3040-\u309f\u30a0-\u30ff]/,
            korean: /[\uac00-\ud7af\u1100-\u11ff]/,
            arabic: /[\u0600-\u06ff\u0750-\u077f]/,
            hebrew: /[\u0590-\u05ff]/,
            thai: /[\u0e00-\u0e7f]/,
            russian: /[\u0400-\u04ff]/,
            greek: /[\u0370-\u03ff]/,
            hindi: /[\u0900-\u097f]/
        }

        // Common word patterns for languages using Latin alphabet
        this.wordPatterns = {
            english: ['the', 'is', 'are', 'what', 'how', 'why', 'can', 'you', 'please', 'help', 'create', 'make'],
            spanish: ['el', 'la', 'los', 'las', 'que', 'como', 'por', 'para', 'hola', 'gracias', 'quiero'],
            french: ['le', 'la', 'les', 'que', 'est', 'sont', 'pour', 'avec', 'bonjour', 'merci', 'comment'],
            german: ['der', 'die', 'das', 'ist', 'sind', 'wie', 'was', 'bitte', 'danke', 'hallo', 'ich'],
            portuguese: ['o', 'a', 'os', 'as', 'que', 'como', 'para', 'obrigado', 'olá', 'por'],
            italian: ['il', 'la', 'che', 'come', 'per', 'ciao', 'grazie', 'sono', 'hai'],
            dutch: ['de', 'het', 'een', 'is', 'zijn', 'wat', 'hoe', 'dank', 'hallo'],
            indonesian: ['yang', 'dan', 'di', 'ini', 'itu', 'untuk', 'dengan', 'apa', 'bagaimana', 'tolong'],
            vietnamese: ['là', 'và', 'của', 'cho', 'này', 'đó', 'như', 'thế', 'nào', 'xin']
        }

        // Language names for responses
        this.languageNames = {
            english: 'English',
            chinese: '中文 (Chinese)',
            japanese: '日本語 (Japanese)',
            korean: '한국어 (Korean)',
            spanish: 'Español (Spanish)',
            french: 'Français (French)',
            german: 'Deutsch (German)',
            portuguese: 'Português (Portuguese)',
            italian: 'Italiano (Italian)',
            arabic: 'العربية (Arabic)',
            russian: 'Русский (Russian)',
            hindi: 'हिन्दी (Hindi)',
            thai: 'ไทย (Thai)',
            vietnamese: 'Tiếng Việt (Vietnamese)',
            indonesian: 'Bahasa Indonesia',
            dutch: 'Nederlands (Dutch)',
            greek: 'Ελληνικά (Greek)',
            hebrew: 'עברית (Hebrew)'
        }
    }

    /**
     * Detect the language of input text
     */
    detect(text) {
        if (!text || text.trim().length === 0) {
            return { language: 'english', confidence: 0, name: 'English' }
        }

        // First check for non-Latin scripts
        for (const [lang, pattern] of Object.entries(this.charPatterns)) {
            const matches = text.match(new RegExp(pattern.source, 'g')) || []
            if (matches.length > text.length * 0.1) { // More than 10% of chars match
                return {
                    language: lang,
                    confidence: Math.min(matches.length / text.length, 1),
                    name: this.languageNames[lang] || lang
                }
            }
        }

        // For Latin-based languages, check common words
        const words = text.toLowerCase().split(/\s+/)
        const scores = {}

        for (const [lang, commonWords] of Object.entries(this.wordPatterns)) {
            scores[lang] = 0
            for (const word of words) {
                if (commonWords.includes(word)) {
                    scores[lang]++
                }
            }
        }

        // Find highest scoring language
        let maxScore = 0
        let detectedLang = 'english'
        for (const [lang, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score
                detectedLang = lang
            }
        }

        return {
            language: detectedLang,
            confidence: Math.min(maxScore / words.length, 1),
            name: this.languageNames[detectedLang] || detectedLang
        }
    }

    /**
     * Get greeting in detected language
     */
    getGreeting(language) {
        const greetings = {
            english: "Hello! I'm Vic AI. How can I help you today?",
            chinese: "你好！我是 Vic AI。今天我能帮你什么？",
            japanese: "こんにちは！Vic AI です。今日は何をお手伝いしましょうか？",
            korean: "안녕하세요! 저는 Vic AI입니다. 오늘 무엇을 도와드릴까요?",
            spanish: "¡Hola! Soy Vic AI. ¿Cómo puedo ayudarte hoy?",
            french: "Bonjour! Je suis Vic AI. Comment puis-je vous aider aujourd'hui?",
            german: "Hallo! Ich bin Vic AI. Wie kann ich Ihnen heute helfen?",
            portuguese: "Olá! Sou Vic AI. Como posso ajudá-lo hoje?",
            italian: "Ciao! Sono Vic AI. Come posso aiutarti oggi?",
            arabic: "مرحبا! أنا Vic AI. كيف يمكنني مساعدتك اليوم؟",
            russian: "Привет! Я Vic AI. Чем могу помочь сегодня?",
            hindi: "नमस्ते! मैं Vic AI हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
            thai: "สวัสดี! ผม Vic AI วันนี้ช่วยอะไรได้บ้าง?",
            vietnamese: "Xin chào! Tôi là Vic AI. Hôm nay tôi có thể giúp gì cho bạn?",
            indonesian: "Halo! Saya Vic AI. Apa yang bisa saya bantu hari ini?",
            dutch: "Hallo! Ik ben Vic AI. Hoe kan ik je vandaag helpen?",
            greek: "Γεια! Είμαι ο Vic AI. Πώς μπορώ να σε βοηθήσω σήμερα;",
            hebrew: "שלום! אני Vic AI. איך אוכל לעזור לך היום?"
        }
        return greetings[language] || greetings.english
    }
}

/**
 * SUBJECT KNOWLEDGE BASE
 * Comprehensive knowledge for math, science, history, etc.
 */
const SUBJECT_KNOWLEDGE = {
    math: {
        name: 'Mathematics',
        topics: {
            arithmetic: {
                operations: ['addition', 'subtraction', 'multiplication', 'division'],
                examples: {
                    addition: '5 + 3 = 8',
                    subtraction: '10 - 4 = 6',
                    multiplication: '7 × 8 = 56',
                    division: '20 ÷ 4 = 5'
                }
            },
            algebra: {
                concepts: ['variables', 'equations', 'functions', 'polynomials'],
                formulas: {
                    quadratic: 'x = (-b ± √(b² - 4ac)) / 2a',
                    linear: 'y = mx + b',
                    slope: 'm = (y₂ - y₁) / (x₂ - x₁)'
                }
            },
            geometry: {
                shapes: ['circle', 'triangle', 'rectangle', 'square', 'polygon'],
                formulas: {
                    circleArea: 'A = πr²',
                    circleCircumference: 'C = 2πr',
                    triangleArea: 'A = ½bh',
                    rectangleArea: 'A = l × w',
                    pythagorean: 'a² + b² = c²'
                }
            },
            calculus: {
                concepts: ['limits', 'derivatives', 'integrals', 'differential equations'],
                formulas: {
                    derivative: "d/dx[xⁿ] = nxⁿ⁻¹",
                    integral: '∫xⁿdx = xⁿ⁺¹/(n+1) + C',
                    chainRule: "d/dx[f(g(x))] = f'(g(x)) × g'(x)"
                }
            },
            statistics: {
                concepts: ['mean', 'median', 'mode', 'standard deviation', 'probability'],
                formulas: {
                    mean: 'μ = Σx / n',
                    variance: 'σ² = Σ(x - μ)² / n',
                    standardDeviation: 'σ = √(Σ(x - μ)² / n)'
                }
            }
        },
        solver: {
            canSolve: ['arithmetic', 'percentages', 'basic algebra', 'unit conversions']
        }
    },

    science: {
        name: 'Science',
        branches: {
            physics: {
                concepts: ['motion', 'force', 'energy', 'waves', 'electricity', 'magnetism'],
                formulas: {
                    velocity: 'v = d / t',
                    acceleration: 'a = (v - u) / t',
                    force: 'F = ma',
                    kineticEnergy: 'KE = ½mv²',
                    potentialEnergy: 'PE = mgh',
                    ohmsLaw: 'V = IR',
                    power: 'P = VI'
                },
                constants: {
                    gravity: 'g = 9.8 m/s²',
                    lightSpeed: 'c = 3 × 10⁸ m/s',
                    planck: 'h = 6.626 × 10⁻³⁴ J·s'
                }
            },
            chemistry: {
                concepts: ['atoms', 'molecules', 'reactions', 'periodic table', 'bonds'],
                elements: ['H (Hydrogen)', 'He (Helium)', 'C (Carbon)', 'N (Nitrogen)', 'O (Oxygen)'],
                formulas: {
                    water: 'H₂O',
                    carbonDioxide: 'CO₂',
                    glucose: 'C₆H₁₂O₆',
                    moles: 'n = m / M'
                }
            },
            biology: {
                concepts: ['cells', 'DNA', 'evolution', 'ecosystems', 'photosynthesis'],
                processes: {
                    photosynthesis: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
                    respiration: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP'
                }
            }
        }
    },

    history: {
        name: 'History',
        periods: {
            ancient: ['Egypt', 'Greece', 'Rome', 'China', 'Mesopotamia'],
            medieval: ['Middle Ages', 'Byzantine Empire', 'Islamic Golden Age'],
            modern: ['Renaissance', 'Industrial Revolution', 'World Wars', 'Digital Age']
        }
    },

    geography: {
        name: 'Geography',
        topics: {
            continents: ['Africa', 'Antarctica', 'Asia', 'Australia/Oceania', 'Europe', 'North America', 'South America'],
            oceans: ['Pacific', 'Atlantic', 'Indian', 'Southern', 'Arctic']
        }
    },

    language: {
        name: 'Language & Literature',
        topics: {
            grammar: ['nouns', 'verbs', 'adjectives', 'adverbs', 'pronouns'],
            writing: ['essays', 'stories', 'poetry', 'reports']
        }
    }
}

/**
 * MATH SOLVER
 * Solves basic mathematical expressions
 */
class MathSolver {
    /**
     * Evaluate a math expression safely
     */
    solve(expression) {
        try {
            // Clean the expression
            let cleaned = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/²/g, '**2')
                .replace(/³/g, '**3')
                .replace(/√(\d+)/g, 'Math.sqrt($1)')
                .replace(/\^/g, '**')

            // Only allow safe characters
            if (!/^[\d\s+\-*/.()Math.sqrtpow,]+$/.test(cleaned)) {
                return { success: false, error: 'Invalid expression' }
            }

            // Evaluate safely
            const result = Function('"use strict"; return (' + cleaned + ')')()

            if (typeof result === 'number' && !isNaN(result)) {
                return {
                    success: true,
                    expression: expression,
                    result: Number.isInteger(result) ? result : parseFloat(result.toFixed(6)),
                    explanation: `${expression} = ${result}`
                }
            }
        } catch (e) {
            // Fall through to error
        }

        return { success: false, error: 'Could not evaluate expression' }
    }

    /**
     * Solve percentage problems
     */
    solvePercentage(text) {
        // "What is X% of Y?"
        let match = text.match(/what\s+is\s+(\d+(?:\.\d+)?)\s*%\s*of\s+(\d+(?:\.\d+)?)/i)
        if (match) {
            const percent = parseFloat(match[1])
            const number = parseFloat(match[2])
            const result = (percent / 100) * number
            return {
                success: true,
                type: 'percentage',
                result: result,
                explanation: `${percent}% of ${number} = ${result}`
            }
        }

        // "X is what % of Y?"
        match = text.match(/(\d+(?:\.\d+)?)\s+is\s+what\s*%\s*of\s+(\d+(?:\.\d+)?)/i)
        if (match) {
            const part = parseFloat(match[1])
            const whole = parseFloat(match[2])
            const result = (part / whole) * 100
            return {
                success: true,
                type: 'percentage',
                result: result.toFixed(2) + '%',
                explanation: `${part} is ${result.toFixed(2)}% of ${whole}`
            }
        }

        return { success: false }
    }

    /**
     * Check if input is a math question
     */
    isMathQuestion(text) {
        const mathPatterns = [
            /\d+\s*[+\-*/×÷^]\s*\d+/,  // Basic operations
            /what\s+is\s+\d+/i,         // "What is..."
            /calculate/i,
            /solve/i,
            /\d+\s*%\s*of/i,            // Percentages
            /square\s*root/i,
            /factorial/i,
            /(\d+)\s*(plus|minus|times|divided)/i
        ]
        return mathPatterns.some(p => p.test(text))
    }
}

/**
 * SUBJECT DETECTOR
 * Detects which subject is being asked about
 */
class SubjectDetector {
    constructor() {
        this.subjectKeywords = {
            math: ['math', 'calculate', 'solve', 'equation', 'formula', 'algebra', 'geometry', 'calculus', 'number', 'plus', 'minus', 'multiply', 'divide', 'percentage', 'fraction'],
            physics: ['physics', 'force', 'energy', 'velocity', 'acceleration', 'gravity', 'momentum', 'wave', 'electricity', 'magnet'],
            chemistry: ['chemistry', 'element', 'atom', 'molecule', 'reaction', 'compound', 'periodic', 'bond', 'acid', 'base'],
            biology: ['biology', 'cell', 'dna', 'gene', 'evolution', 'organism', 'photosynthesis', 'ecosystem', 'species'],
            history: ['history', 'ancient', 'medieval', 'war', 'empire', 'civilization', 'revolution', 'dynasty'],
            geography: ['geography', 'country', 'continent', 'ocean', 'mountain', 'river', 'climate', 'map'],
            language: ['grammar', 'vocabulary', 'writing', 'essay', 'literature', 'poem', 'sentence', 'word']
        }
    }

    detect(text) {
        const lower = text.toLowerCase()
        const scores = {}

        for (const [subject, keywords] of Object.entries(this.subjectKeywords)) {
            scores[subject] = 0
            for (const keyword of keywords) {
                if (lower.includes(keyword)) {
                    scores[subject]++
                }
            }
        }

        let maxScore = 0
        let detectedSubject = null
        for (const [subject, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score
                detectedSubject = subject
            }
        }

        return {
            subject: detectedSubject,
            confidence: maxScore,
            allScores: scores
        }
    }
}

// Export all components
export { LanguageDetector, MathSolver, SubjectDetector, SUBJECT_KNOWLEDGE }
export default { LanguageDetector, MathSolver, SubjectDetector, SUBJECT_KNOWLEDGE }
