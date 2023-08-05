const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');

const app = express();
app.use(express.json());
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/list', async (req, res) => {
  try {
      const response = await openai.listModels();
      res.json(response.data.data);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
  }
});

app.post('/chat-completions', async (req, res) => {
  const { model, messages } = req.body;
  if (!model || !messages) {
    return res.status(400).json({ message: 'Los campos "model" y "messages" son obligatorios' });
  }

  try {
      const {
          model , // Obligatorio. ID del modelo a utilizar. Predeterminado a "gpt-3.5-turbo".
          messages, // Obligatorio. Lista de mensajes que comprenden la conversación hasta ahora.
          temperature, // Opcional. Controla la aleatoriedad de la respuesta del modelo. Rango: 0 a 2.
          top_p, // Opcional. Una alternativa a la temperatura. Rango: 0 a 1.
          n, // Opcional. Cuántas opciones de chat generará el modelo para cada mensaje de entrada.
          stream, // Opcional. Si se establece, se enviarán deltas de mensajes parciales.
          stop, // Opcional. Hasta 4 secuencias donde la API dejará de generar tokens adicionales.
          max_tokens, // Opcional. El número máximo de tokens para generar en la finalización del chat.
          presence_penalty, // Opcional. Penaliza nuevos tokens basándose en su presencia en el texto hasta ahora.
          frequency_penalty, // Opcional. Penaliza nuevos tokens basándose en su frecuencia en el texto hasta ahora.
          logit_bias, // Opcional. Modifica la probabilidad de aparición de tokens especificados.
          user // Opcional. Identificador único que representa a tu usuario final.
      } = req.body;

      const completion = await openai.createChatCompletion({
          model: model,
          messages: messages,
          temperature: temperature,
          top_p: top_p,
          n: n,
          stream: stream,
          stop: stop,
          max_tokens: max_tokens,
          presence_penalty: presence_penalty,
          frequency_penalty: frequency_penalty,
          logit_bias: logit_bias,
          user: user
      });

      res.json(completion.data.choices[0].message);
  } catch (error) {
      res.status(error.status).json({ message: 'An error occurred: '+error.response.data.error.message });
  }
});

app.post('/create-completions', async (req, res) => {
  const { model, prompt } = req.body;
  if (!model || !prompt) {
    return res.status(400).json({ message: 'Los campos "model" y "prompt" son obligatorios' });
  }
  try {
      const {
          model , // Obligatorio. ID del modelo a utilizar. Predeterminado a "gpt-3.5-turbo".
          prompt, // Obligatorio. El/los prompt(s) para generar las completudes.
          max_tokens, // Opcional. El número máximo de tokens a generar en la completitud.
          temperature, // Opcional. Temperatura de muestreo a usar, entre 0 y 2.
          top_p, // Opcional. Una alternativa al muestreo con temperatura, llamado muestreo de núcleo.
          n, // Opcional. Cuántas completudes generar para cada prompt.
          stream, // Opcional. Si se establece, los tokens se enviarán como eventos de servidor.
          stop, // Opcional. Hasta 4 secuencias donde la API dejará de generar tokens adicionales.
          presence_penalty, // Opcional. Número entre -2.0 y 2.0. Penaliza nuevos tokens basados en su presencia.
          frequency_penalty, // Opcional. Número entre -2.0 y 2.0. Penaliza nuevos tokens basados en su frecuencia.
          best_of, // Opcional. Genera las mejores completudes en el lado del servidor y devuelve la "mejor".
          logit_bias, // Opcional. Modifica la probabilidad de que aparezcan tokens especificados en la completitud.
          user, // Opcional. Un identificador único que representa a tu usuario final.
          suffix, // Opcional. El sufijo que viene después de una completitud de texto insertado.
          logprobs, // Opcional. Incluye las probabilidades logarítmicas en los tokens más probables.
          echo // Opcional. Hace eco del prompt además de la completitud.
      } = req.body;

      const completion = await openai.createCompletion({
          model: model,
          prompt: prompt,
          max_tokens: max_tokens,
          temperature: temperature,
          top_p: top_p,
          n: n,
          stream: stream,
          stop: stop,
          presence_penalty: presence_penalty,
          frequency_penalty: frequency_penalty,
          best_of: best_of,
          logit_bias: logit_bias,
          user: user,
          suffix: suffix,
          logprobs: logprobs,
          echo: echo
      });

      res.json(completion.data.choices[0].text);
  } catch (error) {
      res.status(error.response.status).json({ message: 'Ocurrió un error: ' +error.response.data.error.message});
  }


});

app.post('/translate', async (req, res) => {
  const { model, messages, fromLanguage, toLanguage } = req.body;
  if (!model || !messages) {
    return res.status(400).json({ message: 'Los campos "model", "messages", "fromLanguage" y "toLanguage" son obligatorios' });
  }
  try {
    const completion = await openai.createChatCompletion({
      model: model,
      messages: [
        {"role": "system", "content": `You will be provided with a sentence in ${fromLanguage}, and your task is to translate it into ${toLanguage}`},
        {"role": "user", "content": messages}
      ],
      temperature: 0,
      max_tokens: 256,
    });
    res.json(completion.data.choices[0].message.content);
  } catch(error) {
    res.status(error.response.status).json({ message: 'Ocurrió un error: ' + error.response.data.error.message });
  } 
});

const port = 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
