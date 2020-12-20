import React, {useCallback, useEffect} from 'react'
import {useRouter} from '../../common/service/router/hooks'
import {ScreenType} from '../../common/service/router'

export function HabitsScreenView() {
  const router = useRouter()

  const h = useCallback(() => {
    router.replaceTo(ScreenType.Diary)
  }, [router])

  useEffect(() => {
    return router.subscribe((newCurrentRouter) => {
      console.log(newCurrentRouter, 'newCurrentRouter')
    })
  }, [])

  return (
    <div>
      <div>Habits</div>
      <button onClick={h}>{'Diary'}</button>
    </div>
  )
}
