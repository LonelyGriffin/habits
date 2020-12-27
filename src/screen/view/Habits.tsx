import React, {useCallback, useEffect} from 'react'
import {useRouter} from '../../common/service/router/hooks'
import {ScreenType} from '../../common/service/router'
import {Page} from '../../common/view/page'

export function HabitsScreenView() {
  const router = useRouter()

  const h = useCallback(() => {
    router.replaceTo(ScreenType.Diary)
  }, [router])

  return <Page></Page>
}
