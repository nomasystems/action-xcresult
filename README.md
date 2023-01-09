# action-xcresult

A GitHub Action that generates annotations from an xcresult bundle.

# Usage

> For complete input/output documentation, see [action.yml](action.yml).

## Example

```yaml
- uses: nomasystems/action-xcresult@v0.1
  with:
    xcresult-path: MyResultBundle.xcresult
  if: success() || failure()
```
