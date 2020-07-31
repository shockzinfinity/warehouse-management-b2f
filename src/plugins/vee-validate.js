import { required, email, max } from 'vee-validate/dist/rules'
import { extend } from 'vee-validate'

extend('required', {
  ...required,
  message: '이 필드는 필수 입니다.',
})

extend('max', {
  ...max,
  message: '이 필드는 {length} 자 제한입니다.',
})

extend('email', {
  ...email,
  message: '이메일 형식입니다.',
})
