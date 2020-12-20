import React, {useCallback} from 'react'
import {useRouter} from '../../common/service/router/hooks'
import {ScreenType} from '../../common/service/router'

export function DiaryScreenView() {
  const router = useRouter()

  const h = useCallback(() => {
    router.replaceTo(ScreenType.Habits)
  }, [router])

  return (
    <div>
      <div>Diary</div>
      <button onClick={h}>{'Habits'}</button>
    </div>
  )
}
