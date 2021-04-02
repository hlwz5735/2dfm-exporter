/**
 * 此处定义要在全局使用的less样式
 *
 * Ant Design 官方提供了引入配置文件和基于Less modifyVars两种方案，经权衡利弊，我们
 * 选择了第二种方案（第一种方案处理不当会导致打包体积剧增），并将变量的定义从vue.config.js
 * 中单独拿出来使用。
 *
 * 因为vue.config.js默认使用的是CommonJS的打包方式，所以这里没有使用ES Module。不排除
 * 以后随着Vue CLI的升级，现在的这种办法开始不起作用了的情况发生。
 */
module.exports = {
  modifyVars: {
    /* 只要是要在自己的组件中使用一个Ant Design 中定义的变量，都要先将其声明在这里
       否则会因为找不到变量而报错 */
    black: '#000',
    'text-color': 'fade(@black, 65%)',
    'text-color-secondary': 'fade(@black, 45%)',
    'primary-color': '#30A679',
    'body-background': '#fff',
    'layout-header-background': '#20222a',
    'layout-body-background': '#f0f2f5',
    'screen-xl': '1200px',
    'screen-sm': '768px',
    'screen-xs': '480px'
  }
}
