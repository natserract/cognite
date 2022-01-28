import React, { useEffect } from 'react'

import { LayoutProps, AntdLayout, Grid, useNavigation } from '@pankod/refine'
import { useCognito } from 'src/libs/cognito';

export const Layout: React.FC<LayoutProps> = ({
  children,
  Sider,
  Header,
  Footer,
  OffLayoutArea,
}) => {
  const { isAuthenticated } = useCognito();

  const breakpoint = Grid.useBreakpoint()
  const navigation = useNavigation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('/login')
    }
  }, [isAuthenticated])

  return (
    <AntdLayout style={{ minHeight: '100vh', flexDirection: 'row' }}>
      <Sider />
      <AntdLayout>
        <Header />
        <AntdLayout.Content>
          <div
            style={{
              padding: breakpoint.sm ? 24 : 12,
              minHeight: 360,
            }}
          >
            {children}
          </div>
          <OffLayoutArea />
        </AntdLayout.Content>
        <Footer />
      </AntdLayout>
    </AntdLayout>
  )
}
