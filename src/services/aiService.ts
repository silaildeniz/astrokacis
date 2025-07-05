import { User } from '../types';

export interface AIInterpretationRequest {
  question: string;
  birthChart: any;
  user: User;
}

export interface AIZodiacOnlyRequest {
  question: string;
  zodiacSign: string;
  user: User;
}

export interface AIInterpretationResponse {
  interpretation: string;
  confidence: number;
  category: string;
  suggestions?: string[];
}

class AIService {
  private apiUrl = 'https://your-ai-api-endpoint.com/interpret'; // Gerçek API endpoint'i buraya gelecek
  private apiKey = 'your-api-key'; // API anahtarınızı buraya ekleyin

  async interpretBirthChart(request: AIInterpretationRequest): Promise<AIInterpretationResponse> {
    try {
      // Gerçek AI API çağrısı için bu kısmı güncelleyin
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          question: request.question,
          birthChart: request.birthChart,
          userInfo: {
            name: request.user.name,
            birthDate: request.user.birthDate,
            birthTime: request.user.birthTime,
            birthPlace: request.user.birthPlace,
            character: request.user.character,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AI interpretation error:', error);
      
      // Fallback: Mock response
      return this.generateMockResponse(request);
    }
  }

  async interpretZodiacOnly(request: AIZodiacOnlyRequest): Promise<AIInterpretationResponse> {
    try {
      // Gerçek AI API çağrısı için bu kısmı güncelleyin
      const response = await fetch(`${this.apiUrl}/zodiac-only`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          question: request.question,
          zodiacSign: request.zodiacSign,
          userInfo: {
            name: request.user.name,
            character: request.user.character,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AI zodiac interpretation error:', error);
      
      // Fallback: Mock response
      return this.generateZodiacOnlyMockResponse(request);
    }
  }

  private generateMockResponse(request: AIInterpretationRequest): AIInterpretationResponse {
    const { question, birthChart } = request;
    
    // Soru kategorisine göre farklı yanıtlar
    const category = this.categorizeQuestion(question);
    const interpretation = this.generateInterpretationByCategory(category, question, birthChart);
    
    return {
      interpretation,
      confidence: 0.85,
      category,
      suggestions: this.generateSuggestions(category),
    };
  }

  private generateZodiacOnlyMockResponse(request: AIZodiacOnlyRequest): AIInterpretationResponse {
    const { question, zodiacSign } = request;
    
    // Soru kategorisine göre farklı yanıtlar
    const category = this.categorizeQuestion(question);
    const interpretation = this.generateZodiacOnlyInterpretation(category, question, zodiacSign);
    
    return {
      interpretation,
      confidence: 0.75, // Burç sadece yorumu daha düşük güvenilirlik
      category,
      suggestions: this.generateSuggestions(category),
    };
  }

  private generateZodiacOnlyInterpretation(category: string, question: string, zodiacSign: string): string {
    const interpretations = {
      career: [
        `${zodiacSign} burcunuz olarak, ${question.toLowerCase()} konusunda doğal yetenekleriniz var. Bu burç genellikle liderlik ve kararlılık özellikleriyle bilinir.`,
        
        `${zodiacSign} burcunuzun enerjisi, ${question.toLowerCase()} konusunda size özel bir yaklaşım sunuyor. Bu alanda güçlü yanlarınızı kullanarak başarı elde edebilirsiniz.`,
        
        `Astrolojik olarak ${zodiacSign} burcunuz, ${question.toLowerCase()} konusunda belirli karakteristik özellikler gösteriyor. Bu alanda kendinizi geliştirmek için doğal eğilimlerinizi takip edin.`
      ],
      
      love: [
        `${zodiacSign} burcunuz, ${question.toLowerCase()} konusunda romantik tercihlerinizi ve aşk yaklaşımınızı belirliyor. Bu burç genellikle belirli partner tiplerini çeker.`,
        
        `Aşk hayatınızda ${zodiacSign} burcunuzun etkisi büyük. ${question.toLowerCase()} konusunda duygusal ihtiyaçlarınızı ve beklentilerinizi anlamak önemli.`,
        
        `${zodiacSign} burcunuzun enerjisi, ${question.toLowerCase()} konusunda size özel bir romantik yaklaşım sunuyor. Bu alanda kendinizi ifade etme şekliniz benzersiz.`
      ],
      
      health: [
        `${zodiacSign} burcunuz, ${question.toLowerCase()} konusunda sağlık alanlarınızı ve enerji seviyenizi gösteriyor. Bu burç genellikle belirli sağlık odaklarına sahiptir.`,
        
        `Sağlık ve enerji konularında ${zodiacSign} burcunuzun etkisi önemli. ${question.toLowerCase()} konusunda doğal eğilimlerinizi takip etmek faydalı olacaktır.`,
        
        `${zodiacSign} burcunuzun enerjisi, ${question.toLowerCase()} konusunda size özel bir sağlık yaklaşımı sunuyor. Bu alanda denge kurmak için doğal ritminizi dinleyin.`
      ],
      
      personal: [
        `${zodiacSign} burcunuz, ${question.toLowerCase()} konusunda kişisel gelişim alanlarınızı gösteriyor. Bu burç genellikle belirli büyüme fırsatları sunar.`,
        
        `Kişisel gelişim yolculuğunuzda ${zodiacSign} burcunuzun rehberliği önemli. ${question.toLowerCase()} konusunda doğal yeteneklerinizi geliştirmek için odaklanın.`,
        
        `${zodiacSign} burcunuzun enerjisi, ${question.toLowerCase()} konusunda size özel bir gelişim yolu sunuyor. Bu alanda kendinizi keşfetme süreciniz devam ediyor.`
      ],
      
      general: [
        `${zodiacSign} burcunuz olarak, ${question.toLowerCase()} konusunda genel karakteristik özellikleriniz belirleyici. Bu burç genellikle belirli yaşam alanlarında güçlüdür.`,
        
        `Genel olarak ${zodiacSign} burcunuzun enerjisi, ${question.toLowerCase()} konusunda size özel bir perspektif sunuyor. Bu alanda doğal eğilimlerinizi takip etmek faydalı olacaktır.`,
        
        `${zodiacSign} burcunuzun astrolojik etkisi, ${question.toLowerCase()} konusunda belirli fırsatlar ve zorluklar sunuyor. Bu alanda kendinizi anlamak için burç özelliklerinizi inceleyin.`
      ]
    };

    const categoryInterpretations = interpretations[category as keyof typeof interpretations] || interpretations.general;
    return categoryInterpretations[Math.floor(Math.random() * categoryInterpretations.length)];
  }

  private categorizeQuestion(question: string): string {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('kariyer') || lowerQuestion.includes('iş') || lowerQuestion.includes('meslek')) {
      return 'career';
    } else if (lowerQuestion.includes('aşk') || lowerQuestion.includes('ilişki') || lowerQuestion.includes('evlilik')) {
      return 'love';
    } else if (lowerQuestion.includes('sağlık') || lowerQuestion.includes('enerji')) {
      return 'health';
    } else if (lowerQuestion.includes('kişisel') || lowerQuestion.includes('gelişim') || lowerQuestion.includes('amaç')) {
      return 'personal';
    } else {
      return 'general';
    }
  }

  private generateInterpretationByCategory(category: string, question: string, birthChart: any): string {
    const sunSign = birthChart.sun_sign;
    const moonSign = birthChart.moon_sign;
    const risingSign = birthChart.rising_sign;
    const sunHouse = birthChart.planets.sun.house;
    const moonHouse = birthChart.planets.moon.house;

    const interpretations = {
      career: [
        `Güneş burcunuz ${sunSign} olarak, ${question.toLowerCase()} konusunda doğal bir liderlik yeteneğiniz var. ${sunHouse}. evdeki Güneş pozisyonunuz, bu alanda güçlü bir odaklanma olduğunu gösteriyor. Ay burcunuz ${moonSign} ise duygusal motivasyonunuzu belirliyor.`,
        
        `Haritanızda ${risingSign} yükselen burcunuz, ${question.toLowerCase()} konusunda nasıl göründüğünüzü ve ilk izleniminizi belirliyor. ${moonHouse}. evdeki Ay konumunuz, bu alanda duygusal tatmin aradığınızı işaret ediyor.`,
        
        `${sunSign} Güneş burcunuz ve ${moonSign} Ay burcunuz kombinasyonu, ${question.toLowerCase()} konusunda size özel bir yaklaşım sunuyor. Bu alanda yaratıcılığınızı kullanarak başarı elde edebilirsiniz.`
      ],
      
      love: [
        `Venüs pozisyonunuz ${birthChart.planets.venus.sign} olarak, ${question.toLowerCase()} konusunda nasıl aşık olduğunuzu ve romantik tercihlerinizi gösteriyor. ${birthChart.planets.venus.house}. evdeki konumu, aşk hayatınızın hangi alanda yoğunlaştığını belirliyor.`,
        
        `Ay burcunuz ${moonSign}, ${question.toLowerCase()} konusunda duygusal ihtiyaçlarınızı gösteriyor. ${moonHouse}. evdeki konumu, aşk hayatınızda hangi alanlarda tatmin aradığınızı işaret ediyor.`,
        
        `Güneş burcunuz ${sunSign} ve Ay burcunuz ${moonSign} kombinasyonu, ${question.toLowerCase()} konusunda size özel bir yaklaşım sunuyor. Bu alanda kendinizi ifade etme şekliniz benzersiz.`
      ],
      
      health: [
        `Mars pozisyonunuz ${birthChart.planets.mars.sign}, ${question.toLowerCase()} konusunda enerji seviyenizi ve fiziksel motivasyonunuzu gösteriyor. ${birthChart.planets.mars.house}. evdeki konumu, sağlık alanlarınızı belirliyor.`,
        
        `Ay burcunuz ${moonSign}, ${question.toLowerCase()} konusunda duygusal sağlığınızı ve stres yönetiminizi gösteriyor. ${moonHouse}. evdeki konumu, hangi alanlarda denge aradığınızı işaret ediyor.`,
        
        `Güneş burcunuz ${sunSign}, ${question.toLowerCase()} konusunda genel sağlık durumunuzu ve yaşam gücünüzü gösteriyor. ${sunHouse}. evdeki konumu, sağlık odaklarınızı belirliyor.`
      ],
      
      personal: [
        `Jüpiter pozisyonunuz ${birthChart.planets.jupiter.sign}, ${question.toLowerCase()} konusunda büyüme ve genişleme alanlarınızı gösteriyor. ${birthChart.planets.jupiter.house}. evdeki konumu, hangi alanlarda gelişim fırsatları olduğunu işaret ediyor.`,
        
        `Satürn pozisyonunuz ${birthChart.planets.saturn.sign}, ${question.toLowerCase()} konusunda sorumluluk ve disiplin alanlarınızı gösteriyor. ${birthChart.planets.saturn.house}. evdeki konumu, hangi konularda çalışmanız gerektiğini belirliyor.`,
        
        `Güneş burcunuz ${sunSign} ve yükselen burcunuz ${risingSign} kombinasyonu, ${question.toLowerCase()} konusunda kişiliğinizin farklı yönlerini gösteriyor. Bu alanda kendinizi keşfetme yolculuğunuz devam ediyor.`
      ],
      
      general: [
        `Haritanıza genel olarak bakıldığında, ${question.toLowerCase()} konusunda ${sunSign} Güneş burcunuzun etkisi baskın. ${sunHouse}. evdeki konumu, bu alanda odaklanmanız gereken noktaları gösteriyor.`,
        
        `${moonSign} Ay burcunuz ve ${risingSign} yükselen burcunuz, ${question.toLowerCase()} konusunda duygusal ve dış dünya algınızı belirliyor. Bu kombinasyon size özel bir perspektif sunuyor.`,
        
        `Gezegen pozisyonlarınıza bakarak, ${question.toLowerCase()} konusunda ${birthChart.planets.jupiter.sign} Jüpiter'inizin etkisi büyük. Bu, bu alanda büyüme ve genişleme fırsatları olduğunu gösteriyor.`
      ]
    };

    const categoryInterpretations = interpretations[category as keyof typeof interpretations] || interpretations.general;
    return categoryInterpretations[Math.floor(Math.random() * categoryInterpretations.length)];
  }

  private generateSuggestions(category: string): string[] {
    const suggestions = {
      career: [
        'Kariyer değişikliği için uygun zamanları araştırın',
        'Liderlik becerilerinizi geliştirin',
        'Yaratıcı projeler üzerinde çalışın'
      ],
      love: [
        'Kendinizi daha iyi tanıyın',
        'İletişim becerilerinizi geliştirin',
        'Duygusal ihtiyaçlarınızı netleştirin'
      ],
      health: [
        'Düzenli egzersiz yapın',
        'Stres yönetimi teknikleri öğrenin',
        'Beslenme alışkanlıklarınızı gözden geçirin'
      ],
      personal: [
        'Kişisel gelişim kitapları okuyun',
        'Meditasyon pratiği yapın',
        'Yeni beceriler öğrenin'
      ],
      general: [
        'Günlük tutun',
        'Kendinize zaman ayırın',
        'Çevrenizdeki insanlarla bağlantı kurun'
      ]
    };

    return suggestions[category as keyof typeof suggestions] || suggestions.general;
  }
}

export const aiService = new AIService(); 