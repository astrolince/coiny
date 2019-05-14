// require libs
const trae = require('trae')
const { promisify } = require('util')

// require and config db
const redis = require('redis')
const redisPort = process.env.REDIS_PORT
const redisHost = process.env.REDIS_HOST
const redisPass = process.env.REDIS_PASS
const redisClient = redis.createClient(redisPort, redisHost)
redisClient.auth(redisPass)
redisClient.on('error', (err) => {
  console.error('Error ' + err)
})
const redisGet = promisify(redisClient.get).bind(redisClient)
const redisSet = promisify(redisClient.set).bind(redisClient)

// request smartbit api
const getBlocks = async () => {
  try {
    const lastBlockHeight = await trae.get('https://blockstream.info/api/blocks/tip/height')
    const blockchainSize = await trae.get('https://api.smartbit.com.au/v1/blockchain/chart/block-size-total?from=2019-5-10')
    let blocks = {}
    blocks.height = lastBlockHeight.data
    blocks.size = (Number(blockchainSize.data.chart.data.slice(-1)[0].y) / 1000000000).toFixed(2)
    return blocks
  } catch (err) {
    console.error('Error ' + err)
    throw err
  }
}

// export api
module.exports = async (req, res) => {
  try {
    // check last time updated
    const redisReplyBlocksTimeGet = await redisGet('blocks:time')

    const TEN_MINUTES = 10 * 60 * 1000
    const currentTime = Date.now()

    // if blocks:time is empty, just run the update
    const keyTime = ((redisReplyBlocksTimeGet == null) ? (currentTime - TEN_MINUTES) : redisReplyBlocksTimeGet)

    // calc diff
    const timeDiff = currentTime - keyTime

    // if last time >= 10 minutes, update it now
    if (timeDiff >= TEN_MINUTES) {
      // save time of the update
      const redisReplyBlocksTimeSet = await redisSet('blocks:time', currentTime)
      console.log(redisReplyBlocksTimeSet)

      // generate data update
      const blocks = JSON.stringify(await getBlocks())

      // save data
      const redisReplyBlocksSet = await redisSet('blocks', blocks)
      console.log(redisReplyBlocksSet)

      res.end('Updated ' + blocks)
      return
    } else {
      const timeRemaining = new Date(TEN_MINUTES - timeDiff)
      res.end(`Wait ${timeRemaining.getUTCMinutes()} minutes and ${timeRemaining.getUTCSeconds()} seconds`)
      return
    }
  } catch (err) {
    console.error('Error ' + err)
    res.end('Error.')
  }
}
