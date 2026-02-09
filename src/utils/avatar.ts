/** Tailwind gradient classes; index cycles so each row gets a consistent color. */
const AVATAR_COLORS = [
  'bg-gradient-to-br from-purple-500 to-pink-500',
  'bg-gradient-to-br from-blue-500 to-cyan-500',
  'bg-gradient-to-br from-green-500 to-emerald-500',
  'bg-gradient-to-br from-orange-500 to-red-500',
  'bg-gradient-to-br from-indigo-500 to-purple-500',
  'bg-gradient-to-br from-pink-500 to-rose-500',
  'bg-gradient-to-br from-teal-500 to-green-500',
  'bg-gradient-to-br from-yellow-500 to-orange-500',
];

export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const getAvatarColor = (index: number) => {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
};

