import React, {useCallback} from 'react'
import {useRouter} from '../../../common/service/router/hooks'
import {ScreenType} from '../../../common/service/router'
import moment, {Moment} from 'moment'
import {PageHeader, DatePicker} from 'antd'
import * as styles from './Diary.module.less'

export function DiaryScreenView() {
  const router = useRouter()

  const h = useCallback(() => {
    router.replaceTo(ScreenType.Habits)
  }, [router])

  const disabledFeatureDate = useCallback((current: Moment) => current && current > moment().endOf('day'), [])

  return (
    <div className={styles.root}>
      <PageHeader className={styles.header} title={'Дневник'} />
      <DatePicker size={'large'} disabledDate={disabledFeatureDate} />
    </div>
  )
}
