import { Message } from 'ant-design-vue/types/message'
import { ModalConfirm } from 'ant-design-vue/types/modal'

declare module '*.vue' {
  import Vue from 'vue'

  interface Vue {
    $message: Message;
    $info: (modalOptions: ModalOptions) => ModalConfirm;
    $success: (modalOptions: ModalOptions) => ModalConfirm;
    $error: (modalOptions: ModalOptions) => ModalConfirm;
    $warning: (modalOptions: ModalOptions) => ModalConfirm;
    $confirm: (modalOptions: ModalOptions) => ModalConfirm;
  }

  export default Vue
}
