import { GetServerSideProps, NextPage } from 'next'
import OpenSource, { OpenSourceProps } from '@/components/OpenSource'

import { Contributor } from '@/types/github-api'
import _ from 'lodash'
import eodiroAxios from '@/modules/eodiro-axios'

const Page: NextPage<OpenSourceProps> = ({ contributors }) => {
  return <OpenSource contributors={contributors} />
}

export default Page

export const getServerSideProps: GetServerSideProps<OpenSourceProps> = async () => {
  const [, eodiroContributors] = await eodiroAxios<Contributor[]>({
    method: 'get',
    url: 'https://api.github.com/repos/paywteam/eodiro/contributors',
  })
  const [, nextContributors] = await eodiroAxios<Contributor[]>({
    method: 'get',
    url: 'https://api.github.com/repos/paywteam/eodiro-next/contributors',
  })

  const contributors = eodiroContributors

  for (const nextUser of nextContributors) {
    const index = contributors.findIndex(
      (user) => user.login === nextUser.login
    )

    if (index === -1) {
      contributors.push(nextUser)
    } else {
      contributors[index].contributions += nextUser.contributions
    }
  }

  contributors.sort((a, b) => b.contributions - a.contributions)

  return {
    props: {
      contributors,
    },
  }
}
