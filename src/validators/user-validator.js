const joi = require('joi');

const userValidationSchema = joi.object({
    firstname: joi
        .string()
        .min(2)
        .required()
        .messages({
            'string.empty': 'Este campo é obrigatório',
            'string.min':'O nome deve ter no mínimo {#limit} caracteres',
        }),
    lastname: joi
        .string()
        .min(2)
        .required()
        .messages({
            'string.empty': 'Este campo é obrigatório',
            'string.min':'O sobrenome deve ter no mínimo {#limit} caracteres',
        }),
    username: joi
        .string()
        .min(2)
        .required()
        .messages({
            'string.empty': 'Este campo é obrigatório',
            'string.min':'O nome de usuário deve ter no mínimo {#limit} caracteres',
        }),
    email: joi
        .string()
        .email()
        .required()
        .messages({
            'string.empty': 'Este campo é obrigatório',
            'string.email':'Não é um email válido',
        }),
    password: joi
        .string()
        .min(6)
        .required()
        .messages({
            'string.empty': 'Este campo é obrigatório',
            'string.min':'A senha deve possuir no mínimo 6 caracteres',
        }),
    confirmPassword: joi
        .string()
        .valid(joi.ref('password'))
        .required()
        .messages({
          'any.only': 'As senhas não coincidem',
        }),
})

const userLoginValidationSchema = joi.object({
    email: joi
        .string()
        .email()
        .required()
        .messages({
            'string.empty': 'Este campo é obrigatório',
            'string.email':'Não é um email válido',
        }),
    password: joi
        .string()
        .min(6)
        .required()
        .messages({
            'string.empty': 'Este campo é obrigatório',
            'string.min':'A senha deve possuir no mínimo 6 caracteres',
        }),
})

const photoValidationSchema = joi.object({
    title: joi
      .string()
      .min(2)
      .required()
      .messages({
        'string.empty': 'O título é obrigatório',
        'string.min': 'O título deve ter no mínimo {#limit} caracteres',
      }),
    description: joi
      .string()
      .min(2)
      .required()
      .messages({
        'string.empty': 'A descrição é obrigatória',
        'string.min': 'A descrição deve ter no mínimo {#limit} caracteres',
      }),
    tags: joi
      .string()
      .regex(/^#[a-zA-Z0-9_#]+$/)
      .allow(null, '')
      .messages({
        'string.pattern.base': 'A tag deve começar com "#" e conter apenas letras, números ou underscore.',
      }),
  });
  

module.exports = { userValidationSchema, userLoginValidationSchema, photoValidationSchema }