import React, { useState } from "react";
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
  ActionIcon,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconUsers,
  IconSettings,
  IconHome,
  IconUserCircle,
  IconDatabase,
  IconX,
  IconMenu2,
} from "@tabler/icons-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const [active, setActive] = useState(0);
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
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
    >
      {/* Header */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <ActionIcon
              onClick={toggle}
              variant="subtle"
              color="gray"
              size="lg"
              aria-label="Toggle navigation"
            >
              {opened ? <IconX size={20} /> : <IconMenu2 size={20} />}
            </ActionIcon>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Group gap="xs">
              {/* <IconUserCircle size={32} color="#F66600" /> */}
              <Image src="/Logo.png" alt="Logo" h={50} w={50} fit="contain" />
              <Text size="xl" fw={700} c="#F66600">
                Khoa công nghệ thông tin
              </Text>
            </Group>
          </Group>

          {/* <Group visibleFrom="sm">
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
          </Group> */}
        </Group>
      </AppShell.Header>

      {/* Navbar */}
      <AppShell.Navbar p="md">
        <Stack gap="xs">
          <Text size="sm" fw={600} c="dimmed" tt="uppercase" px="xs">
            Menu chính
          </Text>

          {navigationItems.map((item, index) => (
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
                setActive(index);
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
