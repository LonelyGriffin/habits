import React, {useEffect, useState} from 'react'
import * as styles from './Root.module.less'
import {useRouter} from '../../service/router/hooks'
import {DiaryScreenView} from '../../../screen/view/Diary'
import {HabitsScreenView} from '../../../screen/view/Habits'
import {ScreenType} from '../../service/router'

function Root() {
  const router = useRouter()
  const [currentRoute, setCurrentRoute] = useState(router.currentRoute)
  console.log(styles, styles.test)
  useEffect(() => {
    return router.subscribe((newCurrentRouter) => {
      setCurrentRoute(newCurrentRouter)
    })
  }, [])

  switch (currentRoute.screenType) {
    case ScreenType.Diary:
      return <DiaryScreenView />
    case ScreenType.Habits:
      return <HabitsScreenView />
  }
}

export default Root
