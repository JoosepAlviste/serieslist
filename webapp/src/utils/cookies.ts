export const setCookie = (name: string, value: string) => {
  document.cookie = name + '=' + (value || '') + '; SameSite=lax; path=/'
}
