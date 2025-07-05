import { Alert } from 'react-native';

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export class ErrorService {
  static handleError(error: any, context?: string): void {
    console.error(`Error in ${context || 'unknown context'}:`, error);
    
    let userMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
    
    if (error?.code) {
      switch (error.code) {
        case 'permission-denied':
          userMessage = 'Bu işlem için yetkiniz yok.';
          break;
        case 'unavailable':
          userMessage = 'Sunucu şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
          break;
        case 'network-request-failed':
          userMessage = 'İnternet bağlantınızı kontrol edin.';
          break;
        case 'storage/unauthorized':
          userMessage = 'Dosya erişim izni yok.';
          break;
        case 'storage/quota-exceeded':
          userMessage = 'Depolama alanı dolu.';
          break;
        default:
          userMessage = error.message || userMessage;
      }
    }
    
    Alert.alert('Hata', userMessage);
  }
  
  static handleNetworkError(): void {
    Alert.alert(
      'Bağlantı Hatası',
      'İnternet bağlantınızı kontrol edin ve tekrar deneyin.',
      [{ text: 'Tamam' }]
    );
  }
  
  static handleFirebaseError(error: any): void {
    console.error('Firebase Error:', error);
    
    let message = 'Veritabanı hatası oluştu.';
    
    if (error?.code === 'permission-denied') {
      message = 'Bu işlem için yetkiniz yok.';
    } else if (error?.code === 'unavailable') {
      message = 'Sunucu şu anda kullanılamıyor.';
    }
    
    Alert.alert('Veritabanı Hatası', message);
  }
  
  static handleValidationError(field: string): void {
    Alert.alert('Doğrulama Hatası', `Lütfen ${field} alanını kontrol edin.`);
  }
  
  static handleQuizError(): void {
    Alert.alert('Quiz Hatası', 'Quiz yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
  }
  
  static handleSaveError(): void {
    Alert.alert('Kaydetme Hatası', 'Verileriniz kaydedilemedi. Lütfen tekrar deneyin.');
  }
  
  static handleLoadError(): void {
    Alert.alert('Yükleme Hatası', 'Veriler yüklenemedi. Lütfen tekrar deneyin.');
  }
  
  static logError(error: any, context?: string): void {
    console.error(`[${context || 'App'}] Error:`, {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
    });
  }
} 