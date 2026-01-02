const OpenAI = require('openai');

class OpenAIService {
    constructor() {
        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async classifyTicket(title, description) {
        const systemPrompt = `You are an expert support ticket classifier. Analyze the ticket and provide classification.

Your response must be a valid JSON object with these exact fields:
{
  "suggestedPriority": "low" | "medium" | "high" | "critical",
  "suggestedCategory": "technical" | "billing" | "general" | "feature-request" | "bug-report",
  "suggestedQueue": "technical-support" | "billing-support" | "general-support" | "escalation",
  "confidence": number between 0 and 1,
  "reasoning": "Brief explanation of classification"
}

Classification Guidelines:
- PRIORITY:
  - critical: System down, security issues, data loss, affecting many users
  - high: Major functionality broken, urgent business impact
  - medium: Standard issues, moderate impact
  - low: Minor issues, questions, nice-to-haves

- CATEGORY:
  - technical: Software bugs, errors, performance issues, integration problems
  - billing: Payment issues, invoices, subscriptions, refunds
  - general: Account questions, how-to queries, general inquiries
  - feature-request: New feature suggestions, improvements
  - bug-report: Specific bug reports with steps to reproduce

- QUEUE:
  - technical-support: Technical issues requiring developer assistance
  - billing-support: Financial and subscription queries
  - general-support: General inquiries and basic support
  - escalation: Critical issues requiring immediate senior attention`;

        try {
            const response = await this.client.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Title: ${title}\n\nDescription: ${description}` }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.3,
                max_tokens: 300
            });

            const classification = JSON.parse(response.choices[0].message.content);

            return {
                success: true,
                data: {
                    ...classification,
                    classifiedAt: new Date()
                }
            };
        } catch (error) {
            console.error('OpenAI classification error:', error);

            // Fallback classification based on keywords
            return {
                success: true,
                data: this.fallbackClassification(title, description)
            };
        }
    }

    fallbackClassification(title, description) {
        const text = `${title} ${description}`.toLowerCase();

        let suggestedCategory = 'general';
        let suggestedQueue = 'general-support';
        let suggestedPriority = 'medium';

        // Category detection
        if (text.includes('bug') || text.includes('error') || text.includes('crash') || text.includes('fix')) {
            suggestedCategory = 'bug-report';
            suggestedQueue = 'technical-support';
        } else if (text.includes('feature') || text.includes('request') || text.includes('suggest') || text.includes('would like')) {
            suggestedCategory = 'feature-request';
            suggestedQueue = 'general-support';
        } else if (text.includes('payment') || text.includes('invoice') || text.includes('billing') || text.includes('charge') || text.includes('refund')) {
            suggestedCategory = 'billing';
            suggestedQueue = 'billing-support';
        } else if (text.includes('not working') || text.includes('broken') || text.includes('issue') || text.includes('problem') || text.includes('help')) {
            suggestedCategory = 'technical';
            suggestedQueue = 'technical-support';
        }

        // Priority detection
        if (text.includes('urgent') || text.includes('asap') || text.includes('critical') || text.includes('emergency') || text.includes('down')) {
            suggestedPriority = 'critical';
            suggestedQueue = 'escalation';
        } else if (text.includes('important') || text.includes('major') || text.includes('serious')) {
            suggestedPriority = 'high';
        } else if (text.includes('minor') || text.includes('small') || text.includes('when you have time')) {
            suggestedPriority = 'low';
        }

        return {
            suggestedPriority,
            suggestedCategory,
            suggestedQueue,
            confidence: 0.5,
            reasoning: 'Classified using keyword-based fallback system (AI unavailable)',
            classifiedAt: new Date()
        };
    }
}

module.exports = OpenAIService;
