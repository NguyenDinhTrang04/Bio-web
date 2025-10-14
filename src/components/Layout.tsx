import React from "react";
import {
  AppShell,
  Burger,
  Group,
  Button,
  Text,
  NavLink,
  Stack,
  Divider,
  Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconUsers,
  IconSettings,
  IconHome,
  IconUserCircle,
  IconDatabase,
} from "@tabler/icons-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const navigationItems = [
    {
      icon: <IconHome size={20} />,
      label: "Trang chủ",
      path: "/",
    },
    {
      icon: <IconUsers size={20} />,
      label: "Danh sách giảng viên",
      path: "/bio",
    },
    {
      icon: <IconDatabase size={20} />,
      label: "Quản trị",
      path: "/admin",
      badge: "Admin",
    },
  ];

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      {/* Header */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Group gap="xs">
              <IconUserCircle size={32} color="blue" />
              <Text size="xl" fw={700} c="blue">
                Bio Page CNTT
              </Text>
            </Group>
          </Group>

          <Group visibleFrom="sm">
            <Button
              variant="outline"
              onClick={() => navigate("/bio")}
              leftSection={<IconUsers size={16} />}
            >
              Xem giảng viên
            </Button>
            <Button
              onClick={() => navigate("/admin")}
              leftSection={<IconSettings size={16} />}
            >
              Quản trị
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Navbar */}
      <AppShell.Navbar p="md">
        <Stack gap="xs">
          <Text size="sm" fw={600} c="dimmed" tt="uppercase" px="xs">
            Menu chính
          </Text>

          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              leftSection={item.icon}
              label={item.label}
              rightSection={
                item.badge && (
                  <Badge size="sm" variant="filled" color="blue">
                    {item.badge}
                  </Badge>
                )
              }
              active={isActive(item.path)}
              onClick={() => {
                navigate(item.path);
                toggle(); // Close mobile menu
              }}
            />
          ))}

          <Divider my="md" />

          <Text size="xs" c="dimmed" px="xs">
            Hệ thống quản lý thông tin giảng viên
          </Text>
        </Stack>
      </AppShell.Navbar>

      {/* Main content */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default Layout;
