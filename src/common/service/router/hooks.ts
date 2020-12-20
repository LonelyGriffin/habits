import {Router} from './router'
import {useService} from '../../dependencyInjection/hooks'
import {RootDIType} from '../../dependencyInjection/rootType'

export const useRouter = (): Router => useService(RootDIType.Router)
