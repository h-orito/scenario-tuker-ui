type UserResponse = {
  id: number
  name: string
  twitter_user_name: string | null
  follows: Array<User>
  followers: Array<User>
}
