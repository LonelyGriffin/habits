import React, {useEffect, useState} from 'react'
import {useRouter} from '../../service/router/hooks'
import {DiaryScreenView} from '../../../screen/Diary/view/Diary'
import {HabitsScreenView} from '../../../screen/view/Habits'
import {ScreenType} from '../../service/router'
import {LoadingView} from '../../../screen/Loading/view/Loading'

function Root() {
  const router = useRouter()
  const [currentRoute, setCurrentRoute] = useState(router.currentRoute)

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
    case ScreenType.Loading:
      return <LoadingView />
  }
}

export default Root
