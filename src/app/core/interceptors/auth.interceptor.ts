import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Chỉ gắn token cho các request đến backend nội bộ (localhost:8080)
  // Bỏ qua các API bên ngoài như provinces.open-api.vn
  const isInternalRequest = req.url.startsWith('http://localhost:8080') 
    || req.url.startsWith('https://localhost:8080')
    || req.url.startsWith('/');

  if (!isInternalRequest) {
    return next(req);
  }

  const savedUser = localStorage.getItem('user');
  
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      const token = user.token;
      
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(authReq);
      }
    } catch (e) {
      // JSON parse error - ignore
    }
  }
  
  return next(req);
};

