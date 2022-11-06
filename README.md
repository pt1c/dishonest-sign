# (Не)честный знак
Инструмент для получения входящих `УПД` из [ЭДО Лайт](https://xn--80ajghhoc2aj1c8b.xn--p1ai/edo_lite/) Честного Знака и проверки марок.
Инструмент будет полезен при приемке товара и контроля марок.

### Установка:
1. Необходимо установить или воспользоваться любым доступным CORS Proxy:
Варианты CORS Proxy:
- [https://github.com/pt1c/cors-proxy](https://github.com/pt1c/cors-proxy)
- [cors-anyware](https://www.npmjs.com/package/cors-anywhere)
2. Переименовать файл `src/const.expample.ts` в `src/const.ts`
3. Вписать адрес CORS Proxy в `src/const.ts` как значение `CORSProxy`
4. Установить все зависимости. В терминале в корне проекта запустить команду: `npm i`
5. Для запуска разработки с отслеживанием изменений: `npm run start`
Для запуска сборки проекта `npm run start`

### Требования:
1. Установленный в системе криптопровайдер [КриптоПро](https://cryptopro.ru/products/csp)
2. Установленный плагин [CADES plugin](https://www.cryptopro.ru/products/cades/plugin)
3. Зарегестрированная `УКЭП` в [Честном знаке](честныйзнак.рф) и провайдер [ЭДО Лайт](https://xn--80ajghhoc2aj1c8b.xn--p1ai/edo_lite/)



