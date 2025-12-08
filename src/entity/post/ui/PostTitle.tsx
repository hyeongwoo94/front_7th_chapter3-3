import { highlightText } from "../../../shared/lib/utils"

interface PostTitleProps {
  title: string
  highlight?: string
}

export const PostTitle = ({ title, highlight = "" }: PostTitleProps) => {
  return <div>{highlightText(title, highlight)}</div>
}

