export type IdentifiableUser = {
  _id?: string;
  id?: string;
  name?: string;
  avatar?: string;
  profile_image?: string;
};

export function getUserId(user: IdentifiableUser | string | null | undefined): string {
  if (!user) return '';
  if (typeof user === 'string') return user;
  return String(user._id || user.id || '');
}

export function getOtherParticipant<T extends IdentifiableUser>(
  participants: T[] | undefined,
  currentUser: IdentifiableUser | null | undefined,
): T | undefined {
  const currentUserId = getUserId(currentUser);
  return participants?.find((participant) => getUserId(participant) !== currentUserId);
}
