Feature: Init
  I should be able to change my cli preferences

  Scenario: Prefs command to change language
    Given I have already logged in
    When I run prefs command with 'changelang'
    Then I should be able to change the submission language

  Scenario: Prefs command to change server
    Given I have already logged in
    When I run prefs command with 'changeserver'
    Then I should be able to change the submission server

  Scenario: Prefs command to show preferences
    Given I have already logged in
    When I run prefs command with 'show'
    Then I should be able to see the preferences
