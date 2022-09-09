const  TelegramApi = require('node-telegram-bot-api')

// const token = '5528660372:AAEdcvw8ug33PuaTcfiDdVgwDH8hQsxKr0Y'
const token = '5709731499:AAEcPxTZJqSI2aWmxm81__yXN7Scb9-vA6M'

const bot = new TelegramApi(token, {polling:true})

const chats = {}

const item = {}

const againOptioins = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: 'Играть еще раз', callback_data: '/again'}]
        ]
    })
}

const restartOptioins = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: 'Играть еще раз', callback_data: '/restart'}]
        ]
    })
}

const gameOptioins = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: '1', callback_data: '1'},{text: '2', callback_data: '2'},{text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'},{text: '5', callback_data: '5'},{text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'},{text: '8', callback_data: '8'},{text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}]
        ]
    })
}

const listOptioins = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: 'Камень', callback_data: 'Камень'}],
            [{text: 'Ножницы', callback_data: 'Ножницы'}],
            [{text: 'Бумага', callback_data: 'Бумага'}]
        ]
    })
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а ты должен его отгдать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptioins)
    // console.log(chats[chatId])
}

const listGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Игра Камень, ножницы, бумага.')
    const randomItem = Math.floor(Math.random() * 3);
    item[chatId] = randomItem
    await bot.sendMessage(chatId, 'Cделай свой выбор', listOptioins)
}

bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
        return startGame(chatId)
    }

    if (data === '/restart') {
        return listGame(chatId)
    }

    if (data.length > 1) {
        if (data === 'Камень') {
            switch(item[chatId]) {
                case 0:
                    bot.sendMessage(chatId, 'Ничья, бот тоже выбрал камень', restartOptioins)
                    break;
                case 1:
                    bot.sendMessage(chatId, 'Ты победил, бот выбрал ножницы', restartOptioins)
                    break;
                case 2:
                    bot.sendMessage(chatId, 'Ты проиграл, бот выбрал бумагу', restartOptioins)
                    break;
            }
        }
        if (data === 'Ножницы') {
            switch(item[chatId]) {
                case 0:
                    bot.sendMessage(chatId, 'Ты проиграл, бот выбрал камень', restartOptioins)
                    break;
                case 1:
                    bot.sendMessage(chatId, 'Ничья, бот тоже выбрал ножницы', restartOptioins)
                    break;
                case 2:
                    bot.sendMessage(chatId, 'Ты выйграл, бот выбрал бумагу', restartOptioins)
                    break;
            }
        }
        if (data === 'Бумага') {
            switch(item[chatId]) {
                case 0:
                    bot.sendMessage(chatId, 'Ты победил, бот выбрал камень', restartOptioins)
                    break;
                case 1:
                    bot.sendMessage(chatId, 'Ты проиграл, бот выбрал ножницы', restartOptioins)
                    break;
                case 2:
                    bot.sendMessage(chatId, 'Ничья, бот тоже выбрал бумагу', restartOptioins)
                    break;
            }
        }
    } else {
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptioins)
        } else {
            return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptioins)
        }
    }

})



const start = () => {
    bot.setMyCommands([
        {command: '/start', description:'Начальное приветствие'},
        {command: '/info', description:'Информация'},
        {command: '/game', description:'Игра'},
        {command: '/game2', description:'Камень, ножницы, бумага'},
        // {command: '/1000-7', description:'гуль'},
        
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id
        // bot.sendMessage(chatId, `Ты написал мне ${text}`)
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp')
            return bot.sendMessage(chatId, 'Здарова')
        }
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }

        if (text === '/game') {
            return startGame(chatId)

        }

        if (text === '/game2') {
            return listGame(chatId)
        }

        return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/5.webp')
    
        // if (text === '1000-7') {
        //     for(i = 993; i > -2; i-=7) {
        //         await bot.sendMessage(chatId,`${i+7}-7=${i}`)
        //     }
        //     await bot.sendMessage(chatId,'я даун')
        // }
    })
}

start()
