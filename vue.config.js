const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    host:"localhost",
    open:true,
    //代理
    proxy:"http://localhost:2999"
  }
})
