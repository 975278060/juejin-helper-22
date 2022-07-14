require('dotenv').config()
const { getCookie } = require('./cookie')
const JuejinHttp = require('./api')
const { readLogger } = require("../utils/log")




    ; (async () => {

        const cookie = await getCookie()
        const API = new JuejinHttp(cookie)
        console.log(`clear start ...`)
        const articles = await readLogger('article')
        // 文章相关
        if (articles) {
            const keys = Object.keys(articles)
            for (let k of keys) {
                let ids = articles[k]
                if (!ids) continue;
                for (let id of ids) {
                    // 移除收藏的文章
                    if (k == 'collections') {
                        await API.articleCollectRemove(id)
                    }

                    // 删除评论
                    if (k == 'comments') {
                        await API.articleCommentRemove(id)
                    }

                    // 删除点赞文章
                    if (k == 'diggs') {
                        await API.diggCancel(id)
                    }

                    // 删除发布的文章
                    if (k == 'publish') {
                        await API.articleRemove(id)
                    }
                }


            }
        }

        const pins = await readLogger('pins')
        // 沸点相关
        if (pins) {
            const keys = Object.keys(pins)
            for (let k of keys) {
                let ids = pins[k]
                if (!ids) continue;
                for (let id of ids) {
                    // 删除评论
                    if (k == 'comments') {
                        await API.articleCommentRemove(id)
                    }

                    // 删除点赞沸点
                    if (k == 'diggs') {
                        await API.diggCancel(id, 4)
                    }

                    // 删除发布的沸点
                    if (k == 'publish') {
                        await API.pinRemove(id)
                    }
                }
            }
        }

        const follows = await readLogger('follows')
        if (follows) {
            for (let id of follows) {
                // 取消 关注用户
                await API.toggleFollowAuthor(id, false)
            }
        }
        console.log(`clear end ...`)
    })()