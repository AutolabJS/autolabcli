Feature: Init
  I should be able to store my login credentials with  init  command

  Scenario: Init coomand with flags -u and -p for correct login credentials
    Given a valid username as 'testuser1' and corresponding password as 'pass123'
    When I run init command with 'testuser1' as username and 'pass123' as password using 'flags'
    Then My login credentials and private token should be stored locally

  Scenario: Init command without flags for correct login credentials
    Given a valid username as 'testuser1' and corresponding password as 'pass123'
    When I run init command with 'testuser1' as username and 'pass123' as password using 'prompt'
    Then My login credentials and private token should be stored locally

  Scenario: Init command with flags -u and -p for incorrect login credentials
    Given a valid username as 'testuser1' and corresponding password as 'pass123'
    When I run init command with 'testuser1' as username and 'pass111' as password using 'flags'
    Then I should be displayed a warning message

  Scenario: Init command without flags for incorrect login credentials
    Given a valid username as 'testuser1' and corresponding password as 'pass123'
    When I run init command with 'testuser1' as username and 'pass111' as password using 'prompt'
    Then I should be displayed a warning message
