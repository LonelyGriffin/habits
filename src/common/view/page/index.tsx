import React, {useCallback, useEffect, useState} from 'react'
import * as styles from './index.module.less'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import {useRouter} from '../../service/router/hooks'
import {ScreenType} from '../../service/router'
import {YadiskHeaderControl} from '../yadisk/header_controll'

type Props = {
  children: React.ReactNode
}

export function Page(props: Props) {
  const router = useRouter()
  const [route, setRoute] = useState(router.currentRoute)

  useEffect(() => {
    return router.subscribe((curRoute) => {
      setRoute(curRoute)
    })
  })

  return (
    <div className={styles.root}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>{route.screenType === ScreenType.Diary ? 'Дневник' : 'Привычки'}</Typography>
          <YadiskHeaderControl />
        </Toolbar>
      </AppBar>
      <div className={styles.body}>{props.children}</div>
      <BottomNavigation
        value={route.screenType}
        onChange={(_, newValue) => {
          router.replaceTo(newValue)
        }}
        showLabels
      >
        <BottomNavigationAction value={ScreenType.Diary} label='Дневник' />
        <BottomNavigationAction value={ScreenType.Habits} label='Привычки' />
      </BottomNavigation>
    </div>
  )
}
