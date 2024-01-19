'use client';
import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppSettingsSiderHeader } from './libs/siderHeader';
import { MenuItem } from '@grc/_shared/helpers';
import { usePathname, useRouter } from 'next/navigation';
const { Sider } = Layout;

export interface SettingsSideNavProps {
  items: MenuItem[];
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed?: boolean;
}

export const SettingsSideNav = (props: SettingsSideNavProps) => {
  const { items } = props;
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [collapse, setCollapse] = useState<boolean>(false);
  //   const { collapse, setCollapse } = useContext(AppContext);
  //   const isTablet = useMediaQuery(mediaSize.tablet);
  const router = useRouter();
  const pathname = usePathname();
  const urlPath = pathname?.split('/');

  const handleMenuClick = ({ key }: { key: React.Key | string }) => {
    router.push(`/apps/settings/${key}`);
  };

  return (
    <Sider
      collapsed={false}
      collapsedWidth={isMobile ? 0 : 80}
      className="text-lg"
      width={250}
      style={{
        overflow: 'auto',
        backgroundColor: '#F3F3F3',
        position: 'fixed',
        padding: '0',
        height: '100vh',
        scrollbarWidth: 'none',
        scrollbarColor: 'red',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      <AppSettingsSiderHeader collapsed={collapse} setCollapsed={setCollapse} />
      <Menu
        className="sider-menu mt-10"
        style={{
          fontSize: '16px',
          backgroundColor: '#F3F3F3',
          color: '#666666',
        }}
        mode="inline"
        items={items}
        defaultSelectedKeys={['1']}
        selectedKeys={[urlPath?.[3] as string]}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};
