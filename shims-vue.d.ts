declare module 'vue' {
  interface GlobalComponents {
    UModal: DefineComponent<
      unknown,
      unknown,
      {
        title: () => VNode[]
        body: () => VNode[]
        footer: () => VNode[]
      }
    >
  }
}
