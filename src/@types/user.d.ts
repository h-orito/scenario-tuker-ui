type User = {
  id: number
  name: string
  twitter_user_name: string | null
  follows: Array<number>
  followers: Array<number>
}
