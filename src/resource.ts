export type Resource = {
    isResource?: true
    stack?: {
        current: number
        max: number
    }
}