import Avatar1 from '../assets/userImages/photo-1438761681033-6461ffad8d80.jpeg';
import Avatar2 from '../assets/userImages/photo-1463453091185-61582044d556.jpeg';
import Avatar3 from '../assets/userImages/photo-1503467913725-8484b65b0715.jpeg';
import Avatar4 from '../assets/userImages/photo-1519345182560-3f2917c472ef.jpeg';
import Avatar5 from '../assets/userImages/photo-1506089676908-3592f7389d4d.jpeg';
import Avatar6 from '../assets/userImages/photo-1507003211169-0a1dd7228f2d.jpeg';
import Avatar7 from '../assets/userImages/photo-1517202383675-eb0a6e27775f.jpeg';
import Avatar8 from '../assets/userImages/photo-1531251445707-1f000e1e87d0.jpeg';
import Avatar9 from '../assets/userImages/photo-1541271696563-3be2f555fc4e.jpeg';
import Avatar10 from '../assets/userImages/photo-1542345812-d98b5cd6cf98.jpeg';
import Avatar11 from '../assets/userImages/photo-1546539782-6fc531453083.jpeg';
import Avatar12 from '../assets/userImages/photo-1546623381-d6d69cd69955.jpeg';
import Avatar13 from '../assets/userImages/photo-1546820389-44d77e1f3b31.jpeg';
import Avatar14 from '../assets/userImages/photo-1548946526-f69e2424cf45.jpeg';
import Avatar15 from '../assets/userImages/photo-1549351236-caca0f174515.jpeg';
import Avatar16 from '../assets/userImages/photo-1551069613-1904dbdcda11.jpeg';
import Avatar17 from '../assets/userImages/photo-1554384645-13eab165c24b.jpeg';
import Avatar18 from '../assets/userImages/photo-1569443693539-175ea9f007e8.jpeg';
import Avatar19 from '../assets/userImages/photo-1573140247632-f8fd74997d5c.jpeg';
import Avatar20 from '../assets/userImages/photo-1546456073-6712f79251bb.jpeg';
import Avatar21 from '../assets/userImages/photo-1502378735452-bc7d86632805.jpeg';
import Avatar22 from '../assets/userImages/photo-1546967191-fdfb13ed6b1e.jpeg';
import Avatar23 from '../assets/userImages/photo-1502937406922-305bb2789e95.jpeg';
import Avatar24 from '../assets/userImages/photo-1552058544-f2b08422138a.jpeg';

export { PinIcon } from './PinIcon';
export { SearchIcon } from './SearchIcon';

const randomImages = [
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
  Avatar6,
  Avatar7,
  Avatar8,
  Avatar9,
  Avatar10,
  Avatar11,
  Avatar12,
  Avatar13,
  Avatar14,
  Avatar15,
  Avatar16,
  Avatar17,
  Avatar18,
  Avatar19,
  Avatar20,
  Avatar21,
  Avatar22,
  Avatar23,
  Avatar24,
];

export const getRandomImage = () => {
  const index = Math.floor(Math.random() * 24);
  const randomImage = randomImages[index];

  if (typeof randomImage === 'string') {
    return randomImage;
  }

  return '';
};
