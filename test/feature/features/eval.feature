Feature: Eval
  I should be able to submit for evaluations

  Scenario: Eval command to submitting using flags
    Given I have already logged in
    When I run eval command with using 'flags'
    Then I should be able to make submisison

  Scenario: Eval command to submitting using prompt
    Given I have already logged in
    When I run eval command with using 'prompt'
    Then I should be able to make submisison

  Scenario: Eval command for root user when id given
    Given I have logged in as root
    When I run eval command using i flag for id
    Then I should be able to submit for student with the given id

  Scenario: Eval command for root user when id NOT given
    Given I have logged in as root
    When I run eval command without using i flag for id
    Then I should be displayed an error message for invalid submission

  Scenario: Eval command for invalid request
    Given I have already logged in
    When I run eval command with invalid lab
    Then I should be displayed an error message for invalid submission

  Scenario: Eval command for invalid session
    Given I have NOT logged in
    When I run eval command with using 'flags'
    Then I should be displayed an error message for invalid session
