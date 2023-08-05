# Mi Proyecto

(Aquí puedes proporcionar una descripción de tu proyecto)

## Ejemplos de solicitudes de Postman

### Listar todos los elementos

GET http://localhost:3000/list

POST http://localhost:3000/chat-completions

{
"model": "gpt-3.5-turbo",
"messages": [
{"role": "system", "content": "Eres un asistente muy formal"},
{"role": "user", "content": "Cuál es la capital de Francia?"}
],
"temperature": 0.6,
"top_p": 1,
"n": 1,
"stream": false,
"max_tokens": 100,
"presence_penalty": 0,
"frequency_penalty": 0,
"user": "123456"
}

POST http://localhost:3000/create-completions

{
"model": "text-davinci-003",
"prompt": "Cuéntame una historia sobre los completois en chile",
"suffix": ".",
"max_tokens": 100,
"temperature": 0.7,
"top_p": 0.9,
"n": 1,
"stream": false,
"logprobs": 10,
"echo": false,
"stop": ["."],
"presence_penalty": 0.5,
"frequency_penalty": 0.5,
"best_of": 5,
"logit_bias": {"50256": -100},
"user": "usuario1234"
}

POST http://localhost:3000/translate

{
"model": "gpt-3.5-turbo",
"messages": "Chile se encuentra en una zona altamente sísmica debido a la subducción de las placas de Nazca y Antártica en la placa Sudamericana. Este país es considerado el segundo más activo sísmicamente del mundo, solo después de Japón, y es el cuarto más expuesto a sufrir daños graves por desastres naturales. Ubicado en el Cinturón de Fuego del Pacífico, Chile posee la segunda cadena volcánica más grande y activa del mundo, superada solo por Indonesia. En el territorio continental chileno, existen al menos dos mil volcanes; de ellos, se consideran geológicamente activos alrededor de quinientos.",
"fromLanguage": "Spanish",
"toLanguage": "English"
}