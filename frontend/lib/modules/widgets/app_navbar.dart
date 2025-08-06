import 'package:flutter/material.dart';

class AppNavBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const AppNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onTap,
      type: BottomNavigationBarType.fixed,
      selectedItemColor: const Color(0xFF28582E),
      unselectedItemColor: Colors.grey,
      showSelectedLabels: false,
      showUnselectedLabels: false,
      items: [
        BottomNavigationBarItem(
          icon: _buildNavItem(Icons.home, 'Principal', currentIndex == 0),
          label: '',
        ),
        BottomNavigationBarItem(
          icon: _buildNavItem(Icons.contacts, 'Contatos', currentIndex == 1),
          label: '',
        ),
        BottomNavigationBarItem(
          icon:
              _buildNavItem(Icons.collections_bookmark, 'Meus processos', currentIndex == 2),
          label: '',
        ),
        BottomNavigationBarItem(
          icon:
              _buildNavItem(Icons.cloud_sharp, 'Todos processos', currentIndex == 3),
          label: '',
        ),
      ],
    );
  }

  Widget _buildNavItem(IconData icon, String label, bool selected) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 24, color: selected ? const Color(0xFF28582E) : Colors.grey),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: selected ? const Color(0xFF28582E) : Colors.grey,
          ),
        ),
      ],
    );
  }
}
