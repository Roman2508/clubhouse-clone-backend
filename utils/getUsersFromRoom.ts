export type SocketRoomType = Record<string, { roomId: string; user: any }>

export const getUsersFromRoom = (rooms: SocketRoomType, roomId: string) => {
  return Object.values(rooms)
    .filter((obj) => obj.roomId === roomId)
    .map((obj) => obj.user)
}
