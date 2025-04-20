
type StatusColor = {
  bg: string;
  text: string;
};

export const getStatusColor = (status: string): StatusColor => {
  switch (status.toLowerCase()) {
    case 'in use':
      return { bg: 'bg-green-100', text: 'text-green-800' };
    case 'available':
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
    case 'under repair':
      return { bg: 'bg-orange-100', text: 'text-orange-800' };
    case 'retired':
      return { bg: 'bg-red-100', text: 'text-red-800' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800' };
  }
};
