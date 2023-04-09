const userAvatars = import.meta.glob('./*.webp')

for (const key in userAvatars) {
  console.log(key, userAvatars[key])
}
