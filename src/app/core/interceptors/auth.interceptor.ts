import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    if (user.token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`
        }
      });
      return next(cloned);
    }
  }
  return next(req);
};
