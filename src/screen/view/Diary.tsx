import React, {useCallback} from 'react'
import {useRouter} from '../../common/service/router/hooks'
import {ScreenType} from '../../common/service/router'
import {PageHeader, Button} from 'antd'

export function DiaryScreenView() {
  const router = useRouter()

  const h = useCallback(() => {
    router.replaceTo(ScreenType.Habits)
  }, [router])

  return (
    <div>
      <PageHeader title={'Дневник'} />
      <Button onClick={h} type='dashed'>
        {'Habits'}
      </Button>
    </div>
  )
}
