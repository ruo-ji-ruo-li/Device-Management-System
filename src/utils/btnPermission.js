import { App, DirectiveBinding } from 'vue'
import store from "@/store";

export default (app) => {
  app.directive('btnPermission', {
    mounted(el,binding){
    const rights=binding.value.rights //获取绑定的rights,具有这些rights时按钮显示
      //判断是否具有action
      if(!store.getters.rights.some(right => rights.includes(right))){
        el.parentNode.removeChild(el)    //删除按钮
      }
    }
  })
}
