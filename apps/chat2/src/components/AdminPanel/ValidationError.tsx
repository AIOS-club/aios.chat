export const ValidationError = ({errorMessage = ''}: {errorMessage: string | null}) => (
  <div className='admin-panel__form-validation-error'>{errorMessage}</div>
)