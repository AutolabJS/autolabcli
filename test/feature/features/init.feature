Feature: Init
  I should be able to store my login credentials with  init  command

  Scenario: Init coomand with flags -u and -p for correct login credentials
    Given a valid username as 'AutolabJS_Tester' and corresponding password as 'autolabjs123'
    When I run init command with 'AutolabJS_Tester' as username and 'autolabjs123' as password using 'flags'
    Then My login credentials and private token should be stored locally

  Scenario: Init command without flags for correct login credentials
    Given a valid username as 'AutolabJS_Tester' and corresponding password as 'autolabjs123'
    When I run init command with 'AutolabJS_Tester' as username and 'autolabjs123' as password using 'prompt'
    Then My login credentials and private token should be stored locally

  Scenario: Init command with flags -u and -p for incorrect login credentials
    Given a valid username as 'AutolabJS_Tester' and corresponding password as 'autolabjs121'
    When I run init command with 'AutolabJS_Tester' as username and 'autolabjs121' as password using 'flags'
    Then I should be displayed a warning message when invalid input

  Scenario: Init command without flags for incorrect login credentials
    Given a valid username as 'AutolabJS_Tester' and corresponding password as 'autolabjs123'
    When I run init command with 'AutolabJS_Tester' as username and 'autolabjs121' as password using 'prompt'
    Then I should be displayed a warning message when invalid input

  Scenario: Init command with empty inputs in prompt
    Given a valid username as 'AutolabJS_Tester' and corresponding password as 'autolabjs123'
    When I give empty input to init command at the prompt
    Then I should be displayed a warning message to give non-empty input
