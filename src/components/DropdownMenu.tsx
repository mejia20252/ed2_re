// src/components/DropdownMenu.tsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import type { MenuItem } from '../config/menuConfig';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

interface DropdownMenuProps {
  item: MenuItem;
  onItemClick: () => void; // Para cerrar el sidebar móvil
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ item, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { signout } = useAuth(); // Usa el contexto de autenticación
  const navigate = useNavigate();

  const handleSignout = () => {
    signout();
    navigate('/login');
  };

  const handleSubItemClick = (subItem: MenuItem) => {
    onItemClick(); // Cerrar sidebar móvil
    setIsOpen(false); // Cerrar el dropdown

    if (subItem.action === 'signout') {
      handleSignout();
    } else if (subItem.to) {
      // Si tiene 'to', la NavLink se encargará de la navegación
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-6 py-3 text-sm font-medium text-gray-600 transition-colors duration-300 ease-in-out rounded-lg mx-2 hover:bg-gray-100 focus:outline-none"
      >
        <div className="flex items-center">
          <FontAwesomeIcon icon={item.icon || faQuestionCircle} className="mr-3" />
          {item.title}
        </div>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="ml-2 text-xs" />
      </button>
      {isOpen && (
        <ul className="pl-8 mt-1 space-y-1">
          {item.subItems?.map((subItem) => (
            <li key={subItem.title}>
              {subItem.to ? (
                <NavLink
                  to={subItem.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm transition-colors duration-300 ease-in-out rounded-lg
                    ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`
                  }
                  onClick={() => handleSubItemClick(subItem)} // Llama a la nueva función
                >
                  <FontAwesomeIcon icon={subItem.icon || faQuestionCircle} className="mr-3" />
                  {subItem.title}
                </NavLink>
              ) : (
                // *** Renderizar un botón si hay una acción pero no una 'to' ***
                <button
                  onClick={() => handleSubItemClick(subItem)}
                  className="flex items-center w-full text-left px-4 py-2 text-sm transition-colors duration-300 ease-in-out rounded-lg text-gray-500 hover:bg-gray-50 focus:outline-none"
                >
                  <FontAwesomeIcon icon={subItem.icon || faQuestionCircle} className="mr-3" />
                  {subItem.title}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;