export const onBeforeRender = () => {
  return {
    pageContext: {
      documentProps: {
        title: 'My series list',
      },
    },
  }
}
